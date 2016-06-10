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
	console.log(handbook);
	if(handbook !== null){
		$scope.handbook = handbook;
		$scope.isCreating = false;
	}else{
		$scope.handbook = {
			inclusion_status: true,
			complete_status: false	
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