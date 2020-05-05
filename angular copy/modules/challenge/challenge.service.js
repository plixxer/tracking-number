angular.module('challengeModule').factory('challengeService', function ($http) {
	return {
		recent: function(xDays){
			return $http.get("/api/recent/" + xDays).then(function(response){
				return response.data;
			});
		},
		tracker: function(carrier, trackingNumber){
			return $http.get("/api/tracking/" + carrier + "/"+ trackingNumber).then(function(response){
				return response.data;
			});
		}
	};
});