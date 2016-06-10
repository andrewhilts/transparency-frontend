'use strict';
TransparencyApp.controller('GovRequestTypeCtrl', ['$scope', '$location', 'gov_request_category', 'gov_request_type', '$route', 'urls', 'dataProviderService',
function($scope, $location, gov_request_category, gov_request_type, $route, urls, dataProviderService){
	$scope.isCreating = true;

	$scope.gov_request_categoryPath = "#/gov-request-categories/" + gov_request_category.category_id;
	$scope.gov_request_category = gov_request_category;

	if(gov_request_type !== null){
		$scope.gov_request_type = gov_request_type;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var typeJSON = getGovRequestTypeAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/gov-request-categories/" + gov_request_category.category_id + "/gov-request-types", {}, typeJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/gov-request-categories/" + gov_request_category.category_id + "/gov-request-types/" + $scope.gov_request_type.type_id, {}, typeJSON);
	 	}
	 	request.then(function(gov_request_type){
 			$location.path('/gov-request-categories/' + gov_request_category.category_id);
 		});
	}
	var getGovRequestTypeAsJSON = function(){
		var gov_request_type = {};
		gov_request_type.name = $scope.gov_request_type.name;
		gov_request_type.description = $scope.gov_request_type.description;
		return angular.toJson(gov_request_type)
	}

}
]);