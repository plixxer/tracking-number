angular.module('challengeModule')
	.controller("ChallengeController", function ChallengeCtrl($scope, challengeService, $sce) {
	console.log("Controller loaded!");
	$scope.welcomeMessage = "Welcome to the challenge!";

	$scope.deliveryDate = '';
	$scope.isLoadingModal = true;

	challengeService.recent(3).then(function(response){
		console.log("response: ", response);
		$scope.recent = response;
	});

	$scope.modalChange = function(shipping_carrier, tracking_number){
		$scope.isLoadingModal = true;
		challengeService.tracker(shipping_carrier.toLocaleLowerCase(), tracking_number).then(function(response){
			$scope.deliveryDate = response[1];
			console.log("resp", response);
		}).finally(function(){
			$scope.isLoadingModal = false;
		});
	}

});
