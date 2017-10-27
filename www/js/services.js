angular.module('starter.services', [])

    .factory('urlService', function ($http) {
        var url = 'http://10.212.129.97/FYEService/api/';
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
            getSchoolsDetails: function (schoolId) {
                $http.get(url).then(function(response){
                    console.log(response.data);
                });
            }
        }
    })    