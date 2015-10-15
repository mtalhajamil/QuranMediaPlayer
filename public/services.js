angular.module('QuranMediaPlayer.services', []).
  factory('ergastAPIservice', function($http,$location,$window,$rootScope) {

    var ergastAPI = {};


    ergastAPI.getAyaat = function(surahNo) {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3030/getAyaat/'+surahNo
      });
    }

    ergastAPI.getSurahNames = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3030/getSurahNames'
      });
    }
    
    return ergastAPI;

  
  });