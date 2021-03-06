'use strict';


angular.module('QuranMediaPlayer', [
  'QuranMediaPlayer.controllers', 'QuranMediaPlayer.services', 'ngRoute', 'ngAudio', 'angular-websql'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
      when("/fullPage", { templateUrl: "partials/fullPage.html", controller: "fullPageController" }).
      when("/ayatView", { templateUrl: "partials/ayatView.html", controller: "ayatViewController" }).
      when("/search", { templateUrl: "partials/search.html", controller: "searchController" }).
      otherwise({ redirectTo: '/fullPage' });
  }])
  .config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });