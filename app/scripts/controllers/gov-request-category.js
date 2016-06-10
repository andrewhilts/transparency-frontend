'use strict';
TransparencyApp.controller('GovRequestCategoryCtrl', ['$scope', '$location', 'gov_request_category', 'gov_request_types', '$route', 'urls', 'dataProviderService',
function($scope, $location, gov_request_category, gov_request_types, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(gov_request_category !== null){
		gov_request_category.typePath = "#/gov-request-categories/" + gov_request_category.category_id + "/create-gov-request-type";
		$scope.gov_request_category = gov_request_category;
		$scope.gov_request_types = gov_request_types;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var categoryJSON = getCategoryAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/gov-request-categories", {}, categoryJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/gov-request-categories/" + $scope.gov_request_category.category_id, {}, categoryJSON);
	 	}
	 	request.then(function(gov_request_category){
 			$location.path('/gov-request-categories/');
 		});
	}
	var getCategoryAsJSON = function(){
		var gov_request_category = {};
		gov_request_category.name = $scope.gov_request_category.name;
		gov_request_category.description = $scope.gov_request_category.description;
		return angular.toJson(gov_request_category)
	}
	$scope.deleteType = function(type){
		dataProviderService.deleteItem(urls.apiURL(), "/gov-request-categories/" + gov_request_category.category_id + "/gov-request-types/" + type.type_id)
 		.then(function(){
 			$route.reload()
 		})
	}
}
]);