angular.module('QuranMediaPlayer.services', []).
  factory('searchService', function () {
    var searchString = '';

    return {
      getSearchString: function () {
        return searchString;
      },
      setSearchString: function (value) {
        searchString = value;
      }
    }
  }).
  factory('ergastAPIservice', function ($http, $location, $window, $rootScope) {
    var ergastAPI = {};
    ergastAPI.getAyaat = function (surahNo) {
      return $http({
        method: 'GET',
        url: '/getAyaat/' + surahNo
      });
    }

    ergastAPI.getSurahNames = function () {
      return $http({
        method: 'GET',
        url: '/getSurahNames'
      });
    }

    ergastAPI.getAllAyaat = function () {
      return $http({
        method: 'GET',
        url: '/getAllAyaat'
      });
    }

    return ergastAPI;
  }).
  factory('quranDataService', function ($sce, $webSql, $q, $http) {

    var shortName = 'QuranMediaPlayer';
    var version = '1.0';
    var displayName = 'QuranMediaPlayer';
    var maxSize = 65535;
    var ayatList = [];
    var db;
    var store;

    function getData() {
      return $http.get('data.json');
    }
    
    function getSurahFile(surahNo) {
      return $http.get('/JSONFiles/'+ surahNo +'.json');
    }

    function renderAyatNoFromHTML(dataArray) {
      for (var i = dataArray.length - 1; i >= 0; i--) {
        var first = dataArray[i].Ano.substr(0, 7);
        var second = dataArray[i].Ano.substr(7, 7);
        var third = dataArray[i].Ano.substr(14, 7);

        var sum = third + second + first;

        dataArray[i].Ano = $sce.trustAsHtml(sum);
      }
      return dataArray;
    }
    
    function addData(data){
      ayatList = data;
    }

    var getAyaat = function () {
      return renderAyatNoFromHTML(ayatList);
    };
    
    function getSurahList(){
      return $http.get('JSONFiles/SurahList.json');
    };
    
    var getRenderedData = function(unrenderedData){
      return renderAyatNoFromHTML(unrenderedData);
    }
    
    function getAudioList(){
      return $http.get('audioList.json');
    }

    return {
      getAyaat: getAyaat,
      getData: getData,
      addData: addData,
      getAudioList: getAudioList,
      getSurahFile: getSurahFile,
      getRenderedData: getRenderedData,
      getSurahList: getSurahList
    };

  });