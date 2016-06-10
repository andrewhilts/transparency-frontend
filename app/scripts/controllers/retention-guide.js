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