angular.module('QuranMediaPlayer.services', []).
factory('searchService', function () {
  var searchString = '';

  return {
    getSearchString: function () {
      return searchString;
    },
    setSearchString: function(value) {
      searchString = value;
    }
  }
}).
factory('ergastAPIservice', function($http,$location,$window,$rootScope) {

  var ergastAPI = {};


  ergastAPI.getAyaat = function(surahNo) {
    return $http({
      method: 'GET', 
      url: '/getAyaat/'+surahNo
    });
  }

  ergastAPI.getSurahNames = function() {
    return $http({
      method: 'GET', 
      url: '/getSurahNames'
    });
  }

  ergastAPI.getAllAyaat = function() {
    return $http({
      method: 'GET', 
      url: '/getAllAyaat'
    });
  }

  return ergastAPI;

  
});