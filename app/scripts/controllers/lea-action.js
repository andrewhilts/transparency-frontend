'use strict';
TransparencyApp.controller('LEAActionCtrl', ['$scope', '$location', 'lea_category', 'lea_action', '$route', 'urls', 'dataProviderService',
function($scope, $location, lea_category, lea_action, $route, urls, dataProviderService){
	$scope.isCreating = true;

	$scope.lea_categoryPath = "#/lea-categories/" + lea_category.category_id;
	$scope.lea_category = lea_category;

	if(lea_action !== null){
		$scope.lea_action = lea_action;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var actionJSON = getLEAActionAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/lea-categories/" + lea_category.category_id + "/lea-actions", {}, actionJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/lea-categories/" + lea_category.category_id + "/lea-actions/" + $scope.lea_action.action_id, {}, actionJSON);
	 	}
	 	request.then(function(lea_action){
 			$location.path('/lea-categories/' + lea_category.category_id);
 		});
	}
	var getLEAActionAsJSON = function(){
		var lea_action = {};
		lea_action.name = $scope.lea_action.name;
		lea_action.narrative = $scope.lea_action.narrative;
		lea_action.narrative_label = $scope.lea_action.narrative_label;
		return angular.toJson(lea_action)
	}

}
]);