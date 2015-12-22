angular.module('QuranMediaPlayer.controllers', []).
  controller('indexController', function ($scope, $location, $window) {


  }).
  controller('searchController', function ($scope, $sce, ergastAPIservice, searchService, quranDataService) {

    $scope.filter = searchService.getSearchString();

    var quranData = quranDataService.getAyaat();

    if (quranData.length == 0) {
      console.log("inside");
      window.location.href = "/#/fullPage";
    }

    $scope.ayaatList = quranData;


    $scope.search = function (ayat) {
      if ($scope.filter == "")
        return $scope.filter;

      var keyword = new RegExp($scope.filter, 'i');
      return !$scope.filter || keyword.test(ayat.UniText);

    };

  }).
  controller('ayatViewController', function ($scope, $sce, ngAudio, ergastAPIservice, $location, $anchorScroll, quranDataService) {

    var quranData = quranDataService.getAyaat();

    if (quranData.length == 0) {
      console.log("inside");
      window.location.href = "/#/fullPage";
    }

    var stream = '';
    $scope.audio = ngAudio.load('http://data.tanzeem.info/AUDIOS/01_-_Dars-e-Quran/000_Ayat-e-Bismillah/Ayat-e-Bismillah.mp3');
    var nextAudio;
    var AyatNumber = 0;
    var SurahNumber = 0;
    var TotalAyah = "7";
    var check = 1;
    var toggleCheck = 1;
    var previous = [];
    var htmlString = "";

    $scope.surahName = "الفاتحة";
    $scope.toggleClass = "ayatNameContainer";
    $scope.selectedSpeakerNo = "01";
    $scope.selectedSpeakerName = "ڈاکٹر اسرار احمد";




    $scope.speakers = [{ "name": "ڈاکٹر اسرار احمد", "cat": "01" }, { "name": "حافظ عاکف سعید", "cat": "02" }, { "name": "انجینئیر نوید احمد", "cat": "03" }];

    $scope.toggleHeight = function () {
      if ($scope.toggleClass == "ayatNameContainer")
        $scope.toggleClass = "ayatNameContainerClosed";
      else
        $scope.toggleClass = "ayatNameContainer";
    }

    $scope.dropboxitemselected = function (cat, name) {
      $scope.selectedSpeakerNo = cat;
      $scope.selectedSpeakerName = name;
    }

    $scope.changeLayout = function () {

      if (htmlString == "")
        htmlString = "<br />";
      else
        htmlString = "";

      $scope.newLine = $sce.trustAsHtml(htmlString);
    }

    $scope.startAudio = function (SNo, ANo, TAyah) {

      TotalAyah = TAyah;
      AyatNumber = parseInt(ANo);
      SurahNumber = SNo;
      toggleCheck = 1;

      stream = convertToLink(SNo, ANo);

      for (var i = 0; i < previous.length; i++) {
        $scope.ayaatList[previous[i]].class = "notSelectedAyat";
      }

      previous = [];

      $scope.ayaatList[AyatNumber - 1].class = "selectedAyat";
      previous.push(AyatNumber - 1);

      // if (UrlExists(stream)) {
     // checkURL(stream);
      $scope.audio.pause();
      showSpinner();
      
      $scope.audio = ngAudio.load(stream);
      
      $scope.audio.play()
      
      console.log($scope.audio);
      loadNextAyat();
      
      // }
      // else {
      //   alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next");
        
      // }

    }

    // function UrlExists(url) {
    //   var http = new XMLHttpRequest();
    //   http.open('HEAD', url, false)
    //   http.send();
    //   return http.status != 404;
    // }

    // function checkURL(url) {
    //   var request = new XMLHttpRequest;
    //   request.open('GET', url, true);
    //   console.log(request);
    //   request.send();
    //   request.onreadystatechange = function(){
    //     if(request.readyState==200){
    //         alert("working");
    //         //return true;
    //     }else{
    //         alert("not working");
    //         //return false;
    //     }
    // }
    // }



    $scope.$watch(function () {
      if ($scope.audio.progress > 0 && toggleCheck == 1) {
        hideSpinner();
        toggleCheck = 0;
      }
      
      
      if ($scope.audio.remaining == 0 && check == 1) {
        check = 0;
        if ((AyatNumber + 1) > parseInt(TotalAyah))
          alert("End Of Surah");
        else {
          playnext();
        }
      }
    });


    function playnext() {

      $scope.ayaatList[AyatNumber - 2].class = "notSelectedAyat";

      var old = $location.hash();
      $location.hash('ayat-' + (AyatNumber - 1));
      $anchorScroll();
      $location.hash(old);

      $scope.ayaatList[AyatNumber - 1].class = "selectedAyat";
      previous.push(AyatNumber - 1);

      // if (UrlExists(stream)) {
      showSpinner();
      $scope.audio = nextAudio;
      //$scope.audio.pause();
      $scope.audio.play();
      loadNextAyat();
      //}
      // else {
      //   alert("Audio For Ayat Number: " + ANo + " Is Not Available, Move To Next");

      // }

      check = 1;
      toggleCheck = 1;
    }

    function hideSpinner() {
      var divSpin = document.getElementById("spin");
      divSpin.className = "hiddenSpinner";
    }

    function showSpinner() {
      var divSpin = document.getElementById("spin");
      divSpin.className = "spinner";
    }

    function loadNextAyat() {
      getNextAyatLink();
      nextAudio = ngAudio.load(stream);
    }

    function getNextAyatLink() {
      AyatNumber += 1;
      stream = convertToLink(SurahNumber, AyatNumber);
    }

    function convertTo3Digit(val) {
      return ('000' + val).substr(-3);
    }

    function getCat() {
      return $scope.selectedSpeakerNo;
    }

    function convertToLink(SNo, ANo) {
      return 'http://quranacademy.me/MEDIA/AUDIOS/VerseByVerse/Media-1/' + getCat() + '_' + convertTo3Digit(SNo) + "_" + convertTo3Digit(ANo) + ".mp3";
    }

    function filterSurah(data, surahNo) {
      var singleSurah = [];
      singleSurah.length = 0;
      for (var index = 0; index < data.length; index++) {
        if (data[index].SurahNo == surahNo)
          singleSurah.push(data[index]);
      }
      return singleSurah;
    }


    function renderAyatNoFromHTML(res) {
      if (res[0].Ano.length >= 4) {
        for (var i = res.length - 1; i >= 0; i--) {
          var first = res[i].Ano.substr(0, 7);
          var second = res[i].Ano.substr(7, 7);
          var third = res[i].Ano.substr(14, 7);

          var sum = third + second + first;
          res[i].Ano = $sce.trustAsHtml(sum);
        }
      }
      return res;
    }


    $scope.surahDisplay = function (surahNo, surahName) {
      $scope.ayaatList = filterSurah(quranData, surahNo);
      $scope.surahName = surahName;
      var old = $location.hash();
      $location.hash('bismillah');
      $anchorScroll();
      $location.hash(old);
    }

    $scope.ayaatList = [];
    $scope.surahList = [];


    $scope.ayaatList = filterSurah(quranData, "1");

    for (var index = 0; index < quranData.length - 1; index++) {

      if (quranData[index].SurahName != quranData[index + 1].SurahName)
        $scope.surahList.push(quranData[index].SurahName);
    }
    $scope.surahList.push(quranData[quranData.length - 1].SurahName);

  }).
  controller('fullPageController', function ($scope, ergastAPIservice, searchService, quranDataService) {

    function hideSpinner() {
      var divSpin = document.getElementById("spin");
      divSpin.className = "hiddenSpinner";
    }

    function showSpinner() {
      var divSpin = document.getElementById("spin");
      divSpin.className = "spinner";
    }
    
    showSpinner();

    $scope.search = function () {
      searchService.setSearchString($scope.searchString);
      //console.log($scope.searchString);
    }

    quranDataService.startDatabase();


  });

