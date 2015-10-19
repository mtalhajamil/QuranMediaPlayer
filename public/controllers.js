/*angular.module('QuranMediaPlayer.controllers', ['mediaPlayer'],[]).*/
angular.module('QuranMediaPlayer.controllers',[]).
controller('indexController', function($scope,$location,$window) {


}).
controller('fullPageController', function($scope,ergastAPIservice) {

 $(document).ready(function() {
  $('#fullpage').fullpage();


});

}).
controller('ayatViewController', function($scope,$sce,ngAudio,ergastAPIservice,$location,$anchorScroll) {


  var stream = '';
  $scope.audio = ngAudio.load('http://data.tanzeem.info/AUDIOS/01_-_Dars-e-Quran/000_Ayat-e-Bismillah/Ayat-e-Bismillah.mp3');
  var AyatNumber = 0;
  var SurahNumber = 0;
  var TotalAyah = "7";
  var check = 1;
  var previous = [];
  var htmlString = "";
  $scope.surahName = "الفاتحة";
  $scope.toggleClass = "ayatNameContainer";
  $scope.selectedSpeakerNo = "01";
  $scope.selectedSpeakerName = "ڈاکٹر اسرار احمد";

  $scope.speakers = [{"name":"ڈاکٹر اسرار احمد","cat":"01"}, {"name":"حافظ عاکف سعید","cat":"02"}, {"name":"انجینئیر نوید احمد","cat":"03"}];

  $scope.toggleHeight = function(){
    if( $scope.toggleClass == "ayatNameContainer")
      $scope.toggleClass = "ayatNameContainerClosed";
    else
      $scope.toggleClass = "ayatNameContainer";
  }

  $scope.dropboxitemselected = function (cat,name) {
    $scope.selectedSpeakerNo = cat;
    $scope.selectedSpeakerName = name;
  }

  $scope.changeLayout = function(){
    if(htmlString == "")
      htmlString = "<br />";
    else
      htmlString = "";

    $scope.newLine  = $sce.trustAsHtml(htmlString);
  }

  $scope.startAudio = function(SNo,ANo,TAyah){

    TotalAyah = TAyah;
    AyatNumber = parseInt(ANo);
    SurahNumber = SNo;

    stream = convertToLink(SNo,ANo);

    for(i=0;i<previous.length;i++){
      $scope.ayaatList[previous[i]].class = "notSelectedAyat";
      console.log(previous[i]); 
    }

    previous = [];

    $scope.ayaatList[AyatNumber - 1].class = "selectedAyat";
    previous.push(AyatNumber - 1);



    //alert(UrlExists(stream));

    if(UrlExists(stream)){
      $scope.audio.pause();
      $scope.audio = ngAudio.play(stream);
    }
    else{
     alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next" );
     //playnext(AyatNumber);
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

  $scope.ayaatList[AyatNumber - 1].class = "notSelectedAyat";


  var old = $location.hash();
  $location.hash('ayat-' + AyatNumber);
  $anchorScroll();
  $location.hash(old);

  AyatNumber += 1;
  ANo += 1
  stream = convertToLink(SurahNumber,ANo);



  $scope.ayaatList[AyatNumber - 1].class = "selectedAyat";
  previous.push(AyatNumber - 1);

  if(UrlExists(stream)){
    $scope.audio.pause();
    $scope.audio = ngAudio.play(stream);
  }
  else{
   alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next" );

 }
    //alert("File Not Available")

    check = 1;
  }

  function convertTo3Digit(val){
    return ('000' + val).substr(-3);
  }

  function getCat(){
    return $scope.selectedSpeakerNo;
  }

  function convertToLink(SNo,ANo){
    return 'media/Media_' + getCat() + '/01_' + convertTo3Digit(SNo) + "_" + convertTo3Digit(ANo) + ".mp3";
  }

  //$scope.audio = ngAudio.load('http://data.tanzeem.info/AUDIOS/01_-_Dars-e-Quran/000_Ayat-e-Bismillah/Ayat-e-Bismillah.mp3');

  function renderAyatNoFromHTML(res){
      for (var i = res.length - 1; i >= 0; i--) {
        var first =  res[i].Ano.substr(0,7);
        var second = res[i].Ano.substr(7,7);
        var third = res[i].Ano.substr(14,7);

        var sum = third + second + first; 


        res[i].Ano = $sce.trustAsHtml(sum)
      };
      return res;
  }

  $scope.surahDisplay = function(surahNo,surahName){
    ergastAPIservice.getAyaat(surahNo).success(function(res){
      //console.log(res);
      $scope.ayaatList = renderAyatNoFromHTML(res);
    });

    $scope.surahName =  surahName;
  }

  $scope.ayaatList = [];
  $scope.surahList = [];

  ergastAPIservice.getAyaat("1").success(function(res){
      $scope.ayaatList = renderAyatNoFromHTML(res);
    });

  ergastAPIservice.getSurahNames().success(function(res){
    $scope.surahList = res;
  });



});

