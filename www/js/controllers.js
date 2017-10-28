angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, GetSchoolsService, $ionicSideMenuDelegate) {
    $scope.Security = 5;
    $scope.Education = 5;
    $scope.Infra = 5;
    $scope.Sports = 5;
    $scope.Go = function (data) {
      $ionicSideMenuDelegate.toggleLeft();
      $rootScope.$broadcast('requeastModel', [
        {prop: data.value1}, 
        {prop: data.value2},
        {prop: data.value3},
        {prop: data.value4}
      ]);
      //  Highcharts.chart('pie', {
      //   xAxis: {
      //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      //       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      //   },

      //   series: [{
      //     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      //   }]
      // });
    }

    $scope.SchoolAnalysis = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.ChangeSports = function () {
      var user = {};
      return {
        getSports: function () {
          return user.Sports;
        },

        setSports: function (Sports) {
          user.Sports = Sports;
        }
      };
    }

    $scope.ChangeInfra = function () {
      var user = {};
      return {
        getInfra: function () {
          return user.Infra;
        },

        setInfra: function (Infra) {
          user.Infra = Infra;
        }
      };
    }

    $scope.ChangeEducation = function () {
      var user = {};
      return {
        getEducation: function () {
          return user.Education;
        },

        setEducation: function (Education) {
          user.Education = Education;
        }
      };
    }

    $scope.ChangeSecurity = function () {
      var user = {};
      return {
        getSecurity: function () {
          return user.Security;
        },

        setSecurity: function (Security) {
          user.Security = Security;
        }
      };
    }    
  })

  .controller('HomeCtrl', function ($scope, $rootScope, GetSchoolsService,GetSchoolSecurity, GetPincode, GetGeocode) {
    var circle = null;
    var geoMarker = null;
    var serachMarker = null;
    var schoolMarkers = [];
    $scope.serachedLoc = null;
    $scope.schools = [];
    var myLatlng = new google.maps.LatLng(12.972442, 77.580643);

    $scope.results = [
      { obj: 1, active: true },
      { obj: 2, active: false },
      { obj: 3, active: false },
      { obj: 4, active: false }
    ];

    var renderer = new google.maps.DirectionsRenderer({
      suppressPolylines: true,
      polylineOptions: {
        strokeColor: '#C83939',
        strokeOpacity: 1,
        strokeWeight: 3
      }
    });

    var defaultOptions = {
      zoom: 10,
      center: myLatlng,
      panControl: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true,
      rotateControl: true
    };

    var options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    $scope.broadcastMsg = function (state) { 
      $rootScope.$broadcast('stateChange', state);
    }

    var schoolIcon = {
      url: "https://cdn0.iconfinder.com/data/icons/flatt3d-icon-pack/512/Flatt3d-Building-256.png", // url
      scaledSize: new google.maps.Size(20, 20), // scaled size
    };

    var findSchools = function (response) {
      $scope.schools = response;
      $rootScope.$broadcast('schoolsFound',response);
      response.forEach((unit, index)=>{
          var info = GetGeocode.getGeocode();
          info.forEach((value, index)=>{
          schoolMarkers.push(new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(value.lat, value.lng),
            title: unit.SchoolName,
            icon: schoolIcon
          }));
        })
      });
    }

    var createMarker = function (info, icon) {
      serachMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(info.lat, info.lng),
        title: info.address,
        icon: icon
      });

      serachMarker.content = '<div class="infoWindowContent">' + info.address + '</div>';
      google.maps.event.addListener(serachMarker, 'click', function () {
        infoWindow.setContent('<h2>' + serachMarker.title + '</h2>' + serachMarker.content);
        infoWindow.open($scope.map, serachMarker);
      });

      $scope.serachedLoc = info.address;
      $scope.$apply();
    }

    var autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode'] });

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      else {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        else {
          updateLocation(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
        }
        GetPincode.getZipDetails(place.geometry.location.lat(), place.geometry.location.lng()).then(function(data){
          GetSchoolsService.getSchoolsDetails(data).then(function(response){
            findSchools(response);
          });
        });
        createMarker({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), address: place.formatted_address });
      }
    });

    var map = new google.maps.Map(document.getElementById("map"), defaultOptions);

    var updateLocation = function (loc) {
      map.panTo(loc);
      map.setZoom(10);
      map.setCenter(loc);
    }

    $scope.resetAll = function () {
      $scope.swiped = false;
      $scope.isClicked = false;
      angular.element(document.getElementById("autocomplete")).val("");
      serachMarker.setMap(null);
      schoolMarkers.forEach(function (value) {
        value.setMap(null);
      });
      schoolMarkers = [];
      $scope.serachedLoc = null;
      $scope.geolocate();
    }   

    $scope.geolocate = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          var newLocation = new google.maps.LatLng(geolocation.lat, geolocation.lng);
          map.panTo(newLocation);
          map.setCenter(newLocation);
          map.setZoom(18);

          var icon = {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Button_Icon_Cyan.svg/300px-Button_Icon_Cyan.svg.png", // url
            scaledSize: new google.maps.Size(20, 20), // scaled size
          };

          if (geoMarker) { geoMarker.setMap(null); }
          geoMarker = new google.maps.Marker({
            map: map,
            icon: icon,
            position: newLocation,
            title: 'current location'
          });

          if (circle) { circle.setMap(null); }
          circle = new google.maps.Circle({
            strokeColor: '#03a9f4',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#03a9f4',
            fillOpacity: 0.35,
            center: newLocation,
            map: map,
            radius: 80
          });
          circle.bindTo('center', geoMarker, 'position');
          autocomplete.setBounds(circle.getBounds());
        }, error, options);
      }
    }

  })

  .controller('CardsCtrl', function ($scope, $rootScope, GetSchoolSecurity, GetSchoolEducation, GetSchoolInfra, GetSchoolSports) {
    $scope.expanded = false;
    $scope.isDashboard = false;
    $scope.results = [];
    $rootScope.$on('stateChange', function (evt, data) {
      $scope.expanded = data;
    });
    $rootScope.$on('schoolsFound', function (evt, data) {
      $scope.results = [];
      data.forEach((value, index)=>{
        $scope.results.push({id: value.School_Id, name: value.SchoolName, active: index === 0? true:false });
      });
    });
    $rootScope.$on('requeastModel', function (evt, data) {
      $scope.aspects.forEach((value,index)=>{
        if(data[index].prop <=10 && data[index].prop >=7){
            value.score = 'high';
          }  
          else if(data[index].prop <=6 && data[index].prop >=4){
            value.score = 'medium';
          }
          else{
            value.score = 'low';
          }
      });    
    });
    

    $scope.aspects = [
      { aspect: 'Security', score: 'high' },
      { aspect: 'Education', score: 'medium' },
      { aspect: 'Infra', score: 'medium' },
      { aspect: 'Others', score: 'low' }
    ];

    $scope.getData = function (schoolId) {
      if (schoolId) {
        GetSchoolSecurity.getSchoolsSecurity(schoolId).then(function (response) {
          if(response.CrimeLevelData){ $scope.aspects[0] = response.CrimeLevelData.toLowerCase();}
          if(response.ResultLevelData){ $scope.aspects[1] = response.ResultLevelData.toLowerCase();}
          if(response.InfraLevelData){ $scope.aspects[2] = response.InfraLevelData.toLowerCase();}
        });
      }
    } 

    $scope.SchoolAnalysis = function (schoolId) {
      $scope.isDashboard = !$scope.isDashboard;

      GetSchoolSecurity.getSchoolsSecurity(schoolId).then(function (response) {
      var accessLevel=0;
      var accessCheck=0;
      var crimeFactor=0;
      var BVFactor=0;
      if (response[0] == 'Medium') {
        accessLevel = 6;
      }
      else if (response[0] == 'High') {
        accessLevel = 9;
      }
      else if (response[0] == 'Low') {
        accessLevel = 2;
      }
      else{
        accessLevel = 6;        
      }

       if (response[1] == 'Medium') {
        accessCheck = 6;
      }
      else if (response[1] == 'High') {
        accessCheck = 9;
      }
      else if (response[1] == 'Low') {
        accessCheck = 2;
      }
      else{
        accessCheck = 6;        
      }
      
      if (response[2] == 'Medium') {
        crimeFactor = 6;
      }
      else if (response[2] == 'High') {
        crimeFactor = 9;
      }
      else if (response[2] == 'Low') {
        crimeFactor = 2;
      }
      else{
        crimeFactor = 6;        
      }

      if (response[3] == 'Medium') {
        BVFactor = 6;
      }
      else if (response[3] == 'High') {
        BVFactor = 9;
      }
      else if (response[3] == 'Low') {
        BVFactor = 2;
      }
      else{
        BVFactor = 6;        
      }


        Highcharts.chart('pieSecurity', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Security'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            name: 'Security',
            colorByPoint: true,
            data: [{
              name: 'Visitor Access',
              y: accessLevel
            },
            {
              name: 'Visitor Check',
              y: accessCheck
            },
            {
              name: 'Crime',
              y: crimeFactor
            },
            {
              name: 'Background Verification',
              y: BVFactor
            }
            ]
          }]
        });
      });

      GetSchoolEducation.getSchoolsEducation('33120100306').then(function (response) {
        Highcharts.chart('pieEducation', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Education'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            name: 'Education',
            colorByPoint: true,
            data: [{
              name: '10th Pass',
              y: response[12][2][0]
            },
            {
              name: '12th Pass',
              y: response[12][2][1]
            },
            {
              name: 'Top Engg. Selecation',
              y: response[12][2][2]
            },
            {
              name: 'Top Medical Selecation',
              y: response[12][2][3]
            }
            ]
          }]
        });
      });

      // GetSchoolInfra.getSchoolsInfra('33120100306').then(function (response) {
      //   Highcharts.chart('pieInfra', {
      //     chart: {
      //       plotBackgroundColor: null,
      //       plotBorderWidth: null,
      //       plotShadow: false,
      //       type: 'pie'
      //     },
      //     title: {
      //       text: 'Infra'
      //     },
      //     plotOptions: {
      //       pie: {
      //         allowPointSelect: true,
      //         cursor: 'pointer',
      //         dataLabels: {
      //           enabled: true,
      //           format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      //           style: {
      //             color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
      //           }
      //         }
      //       }
      //     },
      //     series: [{
      //       name: 'Infra',
      //       colorByPoint: true,
      //       data: [{
      //         name: 'School Area',
      //         y: response.data[0]
      //       },
      //       {
      //         name: 'Playground Area',
      //         y: response.data[1]
      //       },
      //       {
      //         name: 'Toilet Hygiene',
      //         y: response.data[2]
      //       },
      //       {
      //         name: 'Emergency Access',
      //         y: response.data[3]
      //       }
      //       ]
      //     }]
      //   });
      // })
      
      // GetSchoolSports.getSchoolsSports('33120100306').then(function (response) {
      //   Highcharts.chart('pieSports', {
      //     chart: {
      //       plotBackgroundColor: null,
      //       plotBorderWidth: null,
      //       plotShadow: false,
      //       type: 'pie'
      //     },
      //     title: {
      //       text: 'Sports'
      //     },
      //     plotOptions: {
      //       pie: {
      //         allowPointSelect: true,
      //         cursor: 'pointer',
      //         dataLabels: {
      //           enabled: true,
      //           format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      //           style: {
      //             color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
      //           }
      //         }
      //       }
      //     },
      //     series: [{
      //       name: 'Sports',
      //       colorByPoint: true,
      //       data: [{
      //         name: 'Distict Selection',
      //         y: response.data[0]
      //       },
      //       {
      //         name: 'State Selection',
      //         y: response.data[1]
      //       },
      //       {
      //         name: 'National Selection',
      //         y: response.data[2]
      //       },
      //       {
      //         name: '',
      //         y: response.data[3]
      //       }
      //       ]
      //     }]
      //   });
      // })
      
      window.addEventListener("resize", function () {
        var chart = angular.element('#pie').highcharts();

        var w = angular.element('#container').closest(".wrapper").width()
        // setsize will trigger the graph redraw 
        chart.setSize(
          w, w * (3 / 4), false
        );
      })

      Highcharts.chart('column', {
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
          type: 'column',
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
      });
    }

    window.addEventListener("resize", function () {
      var chart = angular.element('#pie').highcharts();

      var w = angular.element('#container').closest(".wrapper").width()
      // setsize will trigger the graph redraw 
      chart.setSize(
        w, w * (3 / 4), false
      );
    })

    $scope.moveLeft = function (index) {
      if (index !== 0) {
        $scope.results[index].active = false;
        $scope.results[index - 1].active = true;
      }
    }

    $scope.moveRight = function (index) {
      if (index !== $scope.results.length - 1) {
        $scope.results[index].active = false;
        $scope.results[index + 1].active = true;
      }
    }
  })

  .directive('fyeCards', function () {
    return {
      replace: true,
      controller: 'CardsCtrl',
      controllerAs: 'ctrl',
      scope: {
      },
      templateUrl: '../templates/cards.html'
    }
  })

  .directive('chartsType', function () {
    return {
      replace: true,
      controller: 'AppCtrl',
      controllerAs: 'ctrlCharts',
      scope: {
      },
      templateUrl: '../templates/ChartAnalysis.html'
    }
  });