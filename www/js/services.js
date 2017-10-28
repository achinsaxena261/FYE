angular.module('starter.services', [])

    .factory('urlService', function ($http) {
        var url = 'http://10.212.242.183/FYEService/api/';
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
            getSchoolsSecurity: function (schoolId) {
                return $http.get(url + schoolId).then(function (response) {                    
                    return response.data;
                });
            }
        }
    })

    .factory('GetSchoolEducation', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetEducation?id=';
        return {
            getSchoolsEducation: function (schoolId) {
                $http.get(url + schoolId).then(function (response) {
                    console.log(response.data);
                });
            }
        }
    })

    .factory('GetSchoolInfra', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetInfra?id=';
        return {
            getSchoolsInfra: function (schoolId) {
                $http.get(url + schoolId).then(function (response) {
                    console.log(response.data);
                });
            }
        }
    })

    .factory('GetSchoolSports', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetSports?id=';
        return {
            getSchoolsSports: function (schoolId) {
                $http.get(url + schoolId).then(function (response) {
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
