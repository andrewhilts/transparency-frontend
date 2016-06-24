'use strict';
TransparencyApp.controller('GovRequestReportCtrl', ['$scope', '$location', 'request_report', 'report', '$route', 'urls', 'dataProviderService',
function($scope, $location, request_report, report, $route, urls, dataProviderService){
	$scope.isCreating = true;
	if(report !== null){
		report.report_period_start = moment(report.report_period_start).toDate();
		report.report_period_end = moment(report.report_period_end).toDate();
		report.publication_date = moment(report.publication_date).toDate();
		$scope.report = report;
	}
	console.log(request_report)
	if(request_report !== null){
		$scope.request_report = request_report;
		$scope.isCreating = false;
		// for(i in request_report.categories[Object.keys(request_report.categories)][0])
		$scope.header = request_report.categorized_disclosures[Object.keys(request_report.categorized_disclosures)[0]].disclosures[0].disclosure_responses;
		$scope.totals = [];
		for(var key in request_report.categorized_disclosures){
			$scope.request_report.categorized_disclosures[key].addingRequestType = false;
			$scope.request_report.categorized_disclosures[key].newRequestType = {};
		}
		$scope.addingCategory = false;
	}else{
		$scope.request_report = {
			inclusion_status: true,
			complete_status: false	
		}
	}
	var oldDescription;
	var oldHeaderDescription;

	$scope.showDescription = function(description){
		if(oldDescription == description && oldDescription.showDescription === true){
			oldDescription.showDescription = false;
		}
		else{
			if(oldDescription && oldDescription !== description){
				oldDescription.showDescription = false;
			}
			description.showDescription = true;
			oldDescription = description;
		}
		if(oldHeaderDescription){
			oldHeaderDescription.showDescription = false;
		}
	}
	$scope.showHeaderDescription = function(description){
		if(oldHeaderDescription == description && oldHeaderDescription.showDescription === true){
			oldHeaderDescription.showDescription = false;
			console.log(1)
		}
		else{
			if(oldHeaderDescription && oldHeaderDescription !== description){
				oldHeaderDescription.showDescription = false;
			}
			description.showDescription = true;
			oldHeaderDescription = description;
			console.log(2)
		}
		if(oldDescription){
			oldDescription.showDescription = false;
		}
	}

	$scope.closeDropdown = function($event){
		if($event.target.className !== "dropdown" && $event.target.className !== "toggler"){
			if(oldDescription){
				oldDescription.showDescription = false;
			}
			if(oldHeaderDescription){
				oldHeaderDescription.showDescription = false;
			}
		}
	}

	var numberWithCommas=function(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	$scope.compileTotals = function(){
		$scope.totals = [];
		for(var i=0; i<$scope.header.length; i++){
			var colTotal=0;
			for(var category_id in $scope.request_report.categorized_disclosures){
				for(var k=0; k<$scope.request_report.categorized_disclosures[category_id].disclosures.length; k++){
					var cellValue = $scope.request_report.categorized_disclosures[category_id].disclosures[k].disclosure_responses[i].count
					if(parseInt(cellValue)){
						colTotal+=parseInt(cellValue);
					}
				}
			}
			$scope.totals.push(numberWithCommas(colTotal));
		}
	};
	$scope.compileTotals();

	$scope.save = function(){
		var requestReportJSON = getRequestReportAsJSON();
		var request;
		if($scope.isCreating){
			request = dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/gov-request-report", {}, requestReportJSON);
		}
		else{
	 		request = dataProviderService.postItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/gov-request-report", {}, requestReportJSON);
	 	}
	 	request.then(function(report){
 			$scope.unSavedChanges = false;
 			$route.reload();
 		});
	}

$scope.$on("$locationChangeStart", function(event) {
      if ($scope.unSavedChanges && !confirm('You have unsaved changes, continue?'))
        event.preventDefault();
    });

$scope.saveRequestType = function(disclosure_category){
		console.log(disclosure_category)
		var request;
		var requestTypeJSON = disclosure_category.newRequestType;
		// First we create the type
		request = dataProviderService.putItem(urls.apiURL(), "/gov-request-categories/" + disclosure_category.category_id + "/gov-request-types", {}, requestTypeJSON);
	 	request.then(function(requestType){
	 		console.log(requestType);
 			//Now we assign dislosure responses to the type
 			dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + report.report_id + "/gov-request-report/gov-request-categories/" + requestType.category.category_id + "/gov-request-types", {}, requestType)
 			.then(function(assignedDisclosure){
 				console.log(assignedDisclosure);
 				disclosure_category.newDisclosure = {}
 				disclosure_category.disclosures.push(assignedDisclosure);
 			})
 		});
	}

	var getRequestReportAsJSON = function(){
		var request_report = {};
		request_report.inclusion_status = $scope.request_report.inclusion_status;
		request_report.complete_status = $scope.request_report.complete_status;
		request_report.narrative = $scope.request_report.narrative;
		request_report.categorized_disclosures = $scope.request_report.categorized_disclosures;
		console.log(request_report);
		return angular.toJson(request_report)
	}
	$scope.$watch('request_report', function(newReport, oldReport){
		if(oldReport !== newReport){
			$scope.unSavedChanges = true;
		}
	}, true)
}
]);