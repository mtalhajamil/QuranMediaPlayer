'use strict';


angular.module('QuranMediaPlayer',[
  'QuranMediaPlayer.controllers','QuranMediaPlayer.services','ngRoute','ngAudio'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
 when("/fullPage", {templateUrl: "partials/fullPage.html", controller: "fullPageController"}).
 when("/register", {templateUrl: "partials/register.html", controller: "registerController"}).
 when("/ayatView", {templateUrl: "partials/ayatView.html", controller: "ayatViewController"}).
 when("/audio", {templateUrl: "partials/audio.html", controller: "audioController"}).
 otherwise({redirectTo: '/fullPage'});
}]);