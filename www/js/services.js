angular.module('starter.controllers', [])

.factory('urlService',function(){
  var url = 'http://172.17.159.46:8080/api/';
  return{
    getUrl : function(){
      return url;
    }
  }
})