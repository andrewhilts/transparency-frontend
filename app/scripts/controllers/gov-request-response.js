'use strict';
TransparencyApp.controller('GovRequestResponseCtrl', ['$scope', '$location', 'gov_request_response', '$route', 'urls', 'dataProviderService',
function($scope, $location, gov_request_response, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(gov_request_response !== null){
		$scope.gov_request_response = gov_request_response;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var categoryJSON = getCategoryAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/gov-request-responses", {}, categoryJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/gov-request-responses/" + $scope.gov_request_response.response_id, {}, categoryJSON);
	 	}
	 	request.then(function(gov_request_response){
 			$location.path('/gov-request-responses/');
 		});
	}
	var getCategoryAsJSON = function(){
		var gov_request_response = {};
		gov_request_response.name = $scope.gov_request_response.name;
		gov_request_response.description = $scope.gov_request_response.description;
		return angular.toJson(gov_request_response)
	}
}
]);