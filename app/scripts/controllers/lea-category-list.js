'use strict';
TransparencyApp.controller('LEACategoryListCtrl', ['$scope', '$location', 'lea_categories', 'urls', 'dataProviderService', '$route',
function($scope, $location, lea_categories, urls, dataProviderService, $route){
	console.log("hi")
	$scope.lea_categories = lea_categories;

	$scope.deleteCategory = function(category){
		var areYouSure = window.confirm("Are you sure you want to delete this category?");
		if(areYouSure){
			dataProviderService.deleteItem(urls.apiURL(), "/lea-categories/" + category.category_id)
	 		.then(function(lea_actions){
	 			$route.reload()
	 		});
 		}
	}
}
]);