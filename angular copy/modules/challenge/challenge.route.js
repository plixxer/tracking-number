angular.module('challengeModule', ['ngRoute']).config(function($routeProvider,$locationProvider) {
	$routeProvider
	   .when('/challenge', {
		  templateUrl: "/modules/challenge/challenge.html",
		  controller: "ChallengeController"
	   }).otherwise({
		templateUrl : "/modules/challenge/challenge.html",
		controller: "ChallengeController"
	});
});