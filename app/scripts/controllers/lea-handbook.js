'use strict';
TransparencyApp.controller('LEAHandbookCtrl', ['$scope', '$location', 'handbook', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, handbook, report, $route, urls, dataProviderService){
	$scope.isCreating = true;
	$scope.trueValue = true;
	if(report !== null){
		report.report_period_start = moment(report.report_period_start).toDate();
		report.report_period_end = moment(report.report_period_end).toDate();
		report.publication_date = moment(report.publication_date).toDate();
		$scope.report = report;
	}
	$scope.action_selection_types = [
      {id: 1, name: 'Single value'},
      {id: 2, name: 'Multiple value'},
      {id: 3, name: 'Text value'}
    ];
	console.log(handbook);
	if(handbook !== null){
		$scope.handbook = handbook;
		$scope.isCreating = false;
	}else{
		$scope.handbook = {
			inclusion_status: true,
			complete_status: false	
		}
		for(category in $scope.handbook.categories){
			category.addingItem = false;
			category.newItem = {};
		}
		$scope.addingCategory = false;
	}
	$scope.newCategory = {};
	$scope.selected_action_selection_type = {}

	var oldNarrative;

	$scope.showNarrative = function(narrative){
		console.log(narrative)
		if(oldNarrative == narrative && oldNarrative.showNarrative === true){
			oldNarrative.showNarrative = false;
		}
		else{
			if(oldNarrative && oldNarrative !== narrative){
				oldNarrative.showNarrative = false;
			}
			narrative.showNarrative = true;
			oldNarrative = narrative;
		}
	}

	$scope.save = function(){
		var handbookJSON = getHandbookAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/law-enforcement-handbook", {}, handbookJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/law-enforcement-handbook", {}, handbookJSON);
	 	}
	 	request.then(function(report){
 			$route.reload();
 		});
	}
	$scope.saveAction = function(category){
		console.log(category)
		var request;
		var actionJSON = category.newAction;
		// First we create the item
		request = dataProviderService.putItem(urls.apiURL(), "/lea-categories/" + category.parent_category_id + "/lea-actions", {}, actionJSON);
	 	request.then(function(action){
	 		console.log(action, category);
 			//Now we assign the item to the retention guide
 			dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/law-enforcement-handbook/lea-categories/" + category.handbook_category_id + "/lea-actions", {}, action)
 			.then(function(assignedAction){
 				console.log(assignedAction);
 				category.newAction = {}
 				category.actions.push(assignedAction);
 			})
 		});
	}
	$scope.saveCategory = function(){
		console.log($scope.newCategory)
		var request;
		var categoryJSON = $scope.newCategory;
		categoryJSON.action_selection_type = $scope.selected_action_selection_type.id;
		console.log(categoryJSON);
		// First we create the item
		request = dataProviderService.putItem(urls.apiURL(), "/lea-categories", {}, categoryJSON);
	 	request.then(function(category){
	 		console.log(category);
 			//Now we assign the item to the retention guide
 			dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/law-enforcement-handbook/lea-categories", {}, category)
 			.then(function(assignedCategory){
 				console.log(assignedCategory);
 				$scope.handbook.categories.push(assignedCategory);
 				$scope.newCategory = {};
 				$scope.selected_action_selection_type = null;
 			})
 		});
	}
	var getHandbookAsJSON = function(){
		var handbook = {};
		handbook.inclusion_status = $scope.handbook.inclusion_status;
		handbook.complete_status = $scope.handbook.complete_status;
		handbook.narrative = $scope.handbook.narrative;
		handbook.lea_categories = $scope.handbook.categories;
		console.log(handbook);
		return angular.toJson(handbook)
	}
}
]);