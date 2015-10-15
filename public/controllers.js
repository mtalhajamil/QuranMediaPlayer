/*angular.module('QuranMediaPlayer.controllers', ['mediaPlayer'],[]).*/
angular.module('QuranMediaPlayer.controllers',[]).
controller('audioController', function($scope) {


 // access properties

 $scope.mySpecialPlayButton = function () {
  $scope.customText = 'I started angular-media-player with a custom defined action!';
  $scope.audio1.playPause();
};



}).
controller('indexController', function($scope,$location,$window) {


}).
controller('fullPageController', function($scope,ergastAPIservice) {

 $(document).ready(function() {
  $('#fullpage').fullpage();


});

}).
controller('registerController', function($scope,ergastAPIservice) {

  $scope.register = function() {
    ergastAPIservice.sendRegisteration($scope.formData);
  }

}).
controller('ayatViewController', function($scope,ngAudio,ergastAPIservice) {


  var stream = '';
  $scope.audio = ngAudio.load('http://data.tanzeem.info/AUDIOS/01_-_Dars-e-Quran/000_Ayat-e-Bismillah/Ayat-e-Bismillah.mp3');
  var AyatNumber = 0;
  var SurahNumber = 0;
  var TotalAyah = "7";
  var check = 1;



  $scope.startAudio = function(SNo,ANo,TAyah){

    TotalAyah = TAyah;
    AyatNumber = parseInt(ANo);
    SurahNumber = SNo;

    stream = convertToLink('01',SNo,ANo);
    
    //alert(UrlExists(stream));

    if(UrlExists(stream)){
      $scope.audio.pause();
      $scope.audio = ngAudio.play(stream);
    }
    else{
       alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next" );
    }

  }

  function UrlExists(url)
  {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false)
    http.send();
    return http.status!=404;
  }


  $scope.$watch(function(){
    if($scope.audio.remaining == 0 && check == 1){

      check = 0;
      if((AyatNumber + 1) > parseInt(TotalAyah))
        alert("End Of Surah");
      else{
        
        playnext(AyatNumber);
      }
    }
  });

  function playnext(ANo){
    AyatNumber += 1;
    ANo += 1
    stream = convertToLink('01',SurahNumber,ANo);

    if(UrlExists(stream)){
      $scope.audio.pause();
      $scope.audio = ngAudio.play(stream);
    }
    else{
      alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next" );
      //playnext(AyatNumber);
    }

    

    //alert("File Not Available")

    check = 1;
  }

  function convertTo3Digit(val){
    return ('000' + val).substr(-3);
  }

  function convertToLink(cat,SNo,ANo){
    return 'media/Media_' + cat + '/01_' + convertTo3Digit(SNo) + "_" + convertTo3Digit(ANo) + ".mp3";
  }

  //$scope.audio = ngAudio.load('http://data.tanzeem.info/AUDIOS/01_-_Dars-e-Quran/000_Ayat-e-Bismillah/Ayat-e-Bismillah.mp3');

  $scope.surahDisplay = function(surahNo){
    ergastAPIservice.getAyaat(surahNo).success(function(res){
      $scope.ayaatList = res;
    });
  }

  $scope.ayaatList = [];
  $scope.surahList = [];

  ergastAPIservice.getAyaat("1").success(function(res){
      //alert("loaded");
      $scope.ayaatList = res;
    });

  ergastAPIservice.getSurahNames().success(function(res){
    $scope.surahList = res;
  });



});

