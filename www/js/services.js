angular.module('starter.services', [])

    .factory('urlService', function ($http) {
        var url = 'http://10.212.129.97/FYEService/api/';
        //var url = 'http://localhost/FYEService/api/';
        return {
            getUrl: function () {
                return url;
            }
        }
    })

    .factory('GetSchoolsService', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetSchool?Pincode=';
        return {
            getSchoolsDetails: function (zip) {
                $http.get(url + zip).then(function (response) {
                    console.log(response.data);
                });
            }
        }
    })

    .factory('GetSchoolSecurity', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetSecurity?id=';
        return {
            getSchoolsDetails: function (schoolId) {
                $http.get(url).then(function (response) {
                    console.log(response.data);
                });
            }
        }
    })

    .factory('GetPincode', function ($http, urlService) {
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
        return {
            getSchoolsDetails: function (lat, long) {
                $http.get(url + lat + ',' + long + '&sensor=true').then(function (response) {
                    var place = response.data.results[0];
                    for (var i = 0; i < place.address_components.length; i++) {
                        for (var j = 0; j < place.address_components[i].types.length; j++) {
                            if (place.address_components[i].types[j] === "postal_code") {
                                console.log(place.address_components[i].long_name);
                                return place.address_components[i].long_name;
                            }
                        }
                    }
                });
            }
        }
    })     