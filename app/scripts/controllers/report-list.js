'use strict';
TransparencyApp.controller('ReportListCtrl', ['$scope', '$location', 'reports', 'urls', 'dataProviderService', '$route',
function($scope, $location, reports, urls, dataProviderService, $route){
	console.log("hi")
	$scope.reports = reports;

	$scope.deleteReport = function(report){
		dataProviderService.deleteItem(urls.apiURL(), "/transparency-reports/" + report.report_id)
 		.then(function(reports){
 			$route.reload()
 		})
	}
}
]);