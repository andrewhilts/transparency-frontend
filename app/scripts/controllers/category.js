'use strict';
TransparencyApp.controller('CategoryCtrl', ['$scope', '$location', 'category', 'items', '$route', 'urls', 'dataProviderService',
function($scope, $location, category, items, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(category !== null){
		category.itemPath = "#/categories/" + category.category_id + "/create-data-item";
		$scope.category = category;
		$scope.items = items;
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
	$scope.deleteItem = function(item){
		var areYouSure = window.confirm("Are you sure you want to delete this item?");
		if(areYouSure){
			dataProviderService.deleteItem(urls.apiURL(), "/data-categories/" + category.category_id + "/data-items/" + item.item_id)
	 		.then(function(){
	 			$route.reload()
	 		});
 		}
	}
}
]);