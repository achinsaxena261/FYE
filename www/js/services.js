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
        var url = urlService.getUrl() + 'values/GetSchool';
        return {
            getSchoolsDetails: function () {
                $http.get(url).then(function(response){
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
    });