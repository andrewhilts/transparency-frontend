'use strict';
TransparencyApp.controller('ReportCtrl', ['$scope', '$location', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, report, $route, urls, dataProviderService){
	$scope.isCreating = true;

	if(report !== null){
		console.log(report)
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
		console.log(reportJSON);
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/transparency-reports", {}, reportJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + $scope.report.report_id, {}, reportJSON);
	 	}
	 	request.then(function(report){
	 		$scope.unSavedChanges = false;
 		});
	}
	$scope.$on("$locationChangeStart", function(event) {
      if ($scope.unSavedChanges && !confirm('You have unsaved changes, continue?'))
        event.preventDefault();
    });
	var getReportAsJSON = function(){
		var report = {};
		report.author_name = $scope.report.author_name;
		report.report_period_start = $scope.report.report_period_start;
		report.report_period_end = $scope.report.report_period_end;
		report.publication_date = $scope.report.publication_date;
		report.retention_guide_inclusion_status = $scope.report.retention_guide_inclusion_status;
		report.government_requests_report_inclusion_status = $scope.report.government_requests_report_inclusion_status;
		report.law_enforcement_handbook_inclusion_status = $scope.report.law_enforcement_handbook_inclusion_status;
		return angular.toJson(report)
	}
	$scope.$watch('report', function(newReport, oldReport){
		if(oldReport !== newReport){
			$scope.unSavedChanges = true;
		}
	}, true)
}
]);