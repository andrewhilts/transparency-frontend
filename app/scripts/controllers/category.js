'use strict';
TransparencyApp.controller('CategoryCtrl', ['$scope', '$location', 'category', '$route', 'urls', 'dataProviderService',
function($scope, $location, category, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(category !== null){
		category.itemPath = "#/categories/" + category.category_id + "/create-data-item";
		$scope.category = category;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var categoryJSON = getCategoryAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/data-categories", {}, categoryJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/data-categories/" + $scope.category.category_id, {}, categoryJSON);
	 	}
	 	request.then(function(category){
 			$location.path('/categories/');
 		});
	}
	var getCategoryAsJSON = function(){
		var category = {};
		category.name = $scope.category.name;
		category.description = $scope.category.description;
		return angular.toJson(category)
	}
}
]);