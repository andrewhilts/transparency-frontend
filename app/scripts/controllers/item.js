'use strict';
TransparencyApp.controller('ItemCtrl', ['$scope', '$location', 'category', 'item', '$route', 'urls', 'dataProviderService',
function($scope, $location, category, item, $route, urls, dataProviderService){
	$scope.isCreating = true;

	$scope.categoryPath = "#/categories/" + category.category_id;
	$scope.category = category;

	if(item !== null){
		$scope.item = item;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var itemJSON = getItemAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/data-categories/" + category.category_id + "/data-items", {}, itemJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/data-categories/" + category.category_id + "/data-items/" + $scope.item.item_id, {}, itemJSON);
	 	}
	 	request.then(function(item){
 			$location.path('/categories/' + category.category_id);
 		});
	}
	var getItemAsJSON = function(){
		var item = {};
		item.name = $scope.item.name;
		item.description = $scope.item.description;
		return angular.toJson(item)
	}

}
]);