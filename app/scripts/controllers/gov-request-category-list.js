'use strict';
TransparencyApp.controller('GovRequestCategoryListCtrl', ['$scope', '$location', 'gov_request_categories', 'urls', 'dataProviderService', '$route',
function($scope, $location, gov_request_categories, urls, dataProviderService, $route){
	console.log("hi")
	$scope.gov_request_categories = gov_request_categories;

	$scope.deleteCategory = function(category){
		var areYouSure = window.confirm("Are you sure you want to delete this category?");
		if(areYouSure){
			dataProviderService.deleteItem(urls.apiURL(), "/gov-request-categories/" + category.category_id)
	 		.then(function(gov_request_categories){
	 			$route.reload()
	 		});
 		}
	}
}
]);