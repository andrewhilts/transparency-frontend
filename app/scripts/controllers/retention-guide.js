'use strict';
TransparencyApp.controller('RetentionGuideCtrl', ['$scope', '$location', 'guide', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, guide, report, $route, urls, dataProviderService){
	$scope.isCreating = true;
	if(report !== null){
		report.report_period_start = moment(report.report_period_start).toDate();
		report.report_period_end = moment(report.report_period_end).toDate();
		report.publication_date = moment(report.publication_date).toDate();
		$scope.report = report;
	}
	console.log(guide);
	if(guide !== null){
		$scope.guide = guide;
		$scope.isCreating = false;
	}else{
		$scope.guide = {
			inclusion_status: true,
			complete_status: false	
		}
		for(category in $scope.guide.data_categories){
			category.addingItem = false;
			category.newItem = {};
		}
		console.log($scope.guide.data_categories);
	}

	$scope.save = function(){
		var guideJSON = getGuideAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/retention_guide", {}, guideJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/retention_guide", {}, guideJSON);
	 	}
	 	request.then(function(report){
 			$route.reload();
 		});
	}

	$scope.saveItem = function(category){
		console.log(category)
		var request;
		var itemJSON = category.newItem;
		// First we create the item
		request = dataProviderService.putItem(urls.apiURL(), "/data-categories/" + category.parent_category_id + "/data-items", {}, itemJSON);
	 	request.then(function(item){
	 		console.log(item);
 			//Now we assign the item to the retention guide
 			dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/retention_guide/data-categories/" + category.guide_category_id + "/data-items", {}, item)
 			.then(function(assignedItem){
 				console.log(assignedItem);
 				category.items.push(assignedItem);
 			})
 		});
	}
	var getGuideAsJSON = function(){
		var guide = {};
		guide.inclusion_status = $scope.guide.inclusion_status;
		guide.complete_status = $scope.guide.complete_status;
		guide.narrative = $scope.guide.narrative;
		guide.data_categories = $scope.guide.data_categories;
		console.log(guide);
		return angular.toJson(guide)
	}
}
]);