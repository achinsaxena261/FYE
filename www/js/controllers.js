angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


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

  .controller('HomeCtrl', function ($scope) {
    var circle = null;
    var geoMarker = null;
    var serachMarker = null;
    var schoolMarkers = [];
    $scope.serachedLoc = null;
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

    var createMarker = function (info) {
      serachMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(info.lat, info.lng),
        title: info.address
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
        createMarker({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), address: place.formatted_address });
      }
    });

    var map = new google.maps.Map(document.getElementById("map"), defaultOptions);

    var updateLocation = function (loc) {
      map.panTo(loc);
      map.setZoom(10);
      map.setCenter(loc);
    }

    $scope.resetAll = function(){
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


  .controller('CardsCtrl', function ($scope) {
    console.log($scope.results);
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
        results: '='
      },
      templateUrl: '../templates/cards.html'
    }
  });
