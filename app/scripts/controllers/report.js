'use strict';
TransparencyApp.controller('ReportCtrl', ['$scope', '$location', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, report, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(report !== null){
		report.report_period_start = report.report_period_start;
		report.report_period_end = report.report_period_end;
		report.publication_date = report.publication_date;
		report.guidePath = "#/reports/" + report.report_id + "/retention-guide";
		report.handbookPath = "#/reports/" + report.report_id + "/lea-handbook";
		report.govRequestsReportPath = "#/reports/" + report.report_id + "/gov-request-report";
		$scope.report = report;
		$scope.isCreating = false;
	}

	$scope.save = function(){
		var reportJSON = getReportAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/transparency-reports", {}, reportJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + $scope.report.report_id, {}, reportJSON);
	 	}
	 	request.then(function(report){
 			$location.path('/reports/');
 		});
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