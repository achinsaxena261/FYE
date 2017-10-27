angular.module('starter.services', [])

    .factory('urlService', function ($http) {
        var url = 'http://10.212.129.47/api/';
        return {
            getUrl: function () {
                return url;
            }
        }
    })

    .factory('GetSchoolsService', function ($http, urlService) {
        var url = urlService.getUrl() + 'values/GetSchools';
        return {
            getSchoolsDetails: function () {
                $http.get(url).then(function(response){
                    console.log(response.data);
                });
            }
        }
    })