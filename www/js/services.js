angular.module('starter.services', [])

    .factory('urlService', function ($http) {
        var url = 'http://10.212.138.229/FYEService/api/';
        return {
            getUrl: function () {
                return url;
            }
        }
    })

    .factory('GetSchoolsService', function ($http, urlService) {
        var url = urlService.getUrl() + 'Values/GetSchools?zipCode=';
        return {
            getSchoolsDetails: function (zip) {
                return $http.get(url + zip).then(function (response) {
                    console.log(response.data);
                    return response.data;
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
                return $http.get(url + schoolId).then(function (response) {
                    return response.data;
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
            getZipDetails: function (lat, long) {
                return $http.get(url + lat + ',' + long + '&sensor=true').then(function (response) {
                    var place = response.data.results[0];
                    for (var i = 0; i < place.address_components.length; i++) {
                        for (var j = 0; j < place.address_components[i].types.length; j++) {
                            if (place.address_components[i].types[j] === "postal_code") {
                              return place.address_components[i].long_name;
                            }
                        }
                    }
                });
            }
        }
    })     

    .factory('GetGeocode', function() {
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
        return{
            getGeocode: function() {
                return [
                    {lat:'11.044039', lng: '76.958469'},
                    {lat:'11.044079', lng: '76.957922'},
                    {lat:'11.043212', lng: '76.957418'},
                    {lat:'11.044344', lng: '76.956452'},
                    {lat:'11.043491', lng: '76.958609'}
                ];
            }
        }
    })
