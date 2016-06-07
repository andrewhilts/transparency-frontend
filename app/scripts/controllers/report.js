'use strict';
TransparencyApp.controller('ReportCtrl', ['$scope', '$location', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, report, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(report !== null){
		report.report_period_start = moment(report.report_period_start).toDate();
		report.report_period_end = moment(report.report_period_end).toDate();
		report.publication_date = moment(report.publication_date).toDate();
		$scope.report = report;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var reportJSON = getReportAsJSON();
		if($scope.isCreating){
			dataProviderService.putItem(urls.apiURL(), "/transparency-reports", {}, reportJSON)
	 		.then(function(report){
	 			$location.path('/reports/' + report.report_id);
	 		});
		}
		else{
	 		dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + $scope.report.report_id, {}, reportJSON)
	 		.then(function(report){
	 			$route.reload();
	 		});
 		}
	}
	var getReportAsJSON = function(){
		var report = {};
		report.author_name = $scope.report.author_name;
		report.report_period_start = $scope.report.report_period_start;
		report.report_period_end = $scope.report.report_period_end;
		report.publication_date = $scope.report.publication_date;
		return angular.toJson(report)
	}
}
]);