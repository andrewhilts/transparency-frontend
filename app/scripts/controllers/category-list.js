'use strict';
TransparencyApp.controller('CategoryListCtrl', ['$scope', '$location', 'categories', 'urls', 'dataProviderService', '$route',
function($scope, $location, categories, urls, dataProviderService, $route){
	console.log("hi")
	$scope.categories = categories;

	$scope.deleteCategory = function(category){
		dataProviderService.deleteItem(urls.apiURL(), "/data-categories/" + category.category_id)
 		.then(function(categories){
 			$route.reload()
 		})
	}
}
]);