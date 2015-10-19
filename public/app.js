'use strict';


angular.module('QuranMediaPlayer',[
  'QuranMediaPlayer.controllers','QuranMediaPlayer.services','ngRoute','ngAudio'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
 when("/fullPage", {templateUrl: "partials/fullPage.html", controller: "fullPageController"}).
 when("/ayatView", {templateUrl: "partials/ayatView.html", controller: "ayatViewController"}).
 otherwise({redirectTo: '/fullPage'});
}]);