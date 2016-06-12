'use strict';
TransparencyApp.controller('LEACategoryCtrl', ['$scope', '$location', 'lea_category', 'lea_actions', '$route', 'urls', 'dataProviderService',
function($scope, $location, lea_category, lea_actions, $route, urls, dataProviderService){
	$scope.isCreating = true;

	$scope.action_selection_types = [
      {id: 1, name: 'Single value'},
      {id: 2, name: 'Multiple value'},
      {id: 3, name: 'Text value'}
    ];

	if(lea_category !== null){
		lea_category.actionPath = "#/lea-categories/" + lea_category.category_id + "/create-lea-action";
		$scope.lea_category = lea_category;
		$scope.lea_actions = lea_actions;
		$scope.isCreating = false;lea_category.action_selection_type
		$scope.selected_action_selection_type = _.findWhere($scope.action_selection_types, {id: lea_category.action_selection_type});
	}

	$scope.save = function(){
		var LEAcategoryJSON = getLEACategoryAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/lea-categories", {}, LEAcategoryJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/lea-categories/" + $scope.lea_category.category_id, {}, LEAcategoryJSON);
	 	}
	 	request.then(function(lea_category){
 			$location.path('/lea-categories/');
 		});
	}
	var getLEACategoryAsJSON = function(){
		var lea_category = {};
		lea_category.name = $scope.lea_category.name;
		lea_category.action_selection_type = $scope.selected_action_selection_type.id;
		return angular.toJson(lea_category)
	}
	$scope.deleteAction = function(lea_action){
		var areYouSure = window.confirm("Are you sure you want to delete this?");
		if(areYouSure){
			dataProviderService.deleteAction(urls.apiURL(), "/lea-categories/" + lea_category.category_id + "/lea-actions/" + lea_action.action_id)
	 		.then(function(){
	 			$route.reload()
	 		});
 		}
	}
}
]);