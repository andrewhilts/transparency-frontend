'use strict';
TransparencyApp.controller('GovRequestResponseListCtrl', ['$scope', '$location', 'gov_request_responses', 'urls', 'dataProviderService', '$route',
function($scope, $location, gov_request_responses, urls, dataProviderService, $route){
	console.log("hi")
	$scope.gov_request_responses = gov_request_responses;

	$scope.deleteResponse = function(response){
		var areYouSure = window.confirm("Are you sure you want to delete this?");
		if(areYouSure){
			dataProviderService.deleteItem(urls.apiURL(), "/gov-request-responses/" + response.response_id)
	 		.then(function(gov_request_responses){
	 			$route.reload()
	 		});
 		}
	}
}
]);