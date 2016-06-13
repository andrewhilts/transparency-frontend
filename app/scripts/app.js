/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

var TransparencyApp = angular.module('TransparencyApp', [
    'config',
    'ngRoute',
    'ngEnter',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'dataProviderService',
    'pascalprecht.translate',
    'ngclipboard'
  ])
  .service('cmsStatus', ['$location', function($location){
    var online = false;
    var firstRun = true;
    var path;
    var redirect = false;
    this.isOnline = function(status){
      if(typeof status === "undefined"){
        return online;
      }
      if(!firstRun && !online && status){
        redirect = true;
      }
      else{
        redirect = false;
      }
      if(status === true){
        online = true;
      }
      else{
        online = false;
        $location.path('/offline');
      }
      if(redirect){
        $location.path(path);
      }
      firstRun = false;
    }
  }])
  .service('urls', ['envOptions', '$translate', function(envOptions, $translate){
    this.apiURL = function(){
      var url;
      var languageCode = envOptions.languageCode;
      // console.log($translate.use());
      // if(typeof $translate.use() !== "undefined"){
      //   languageCode = $translate.use();
      // }
      url = envOptions.apiDomain + envOptions.apiRoot
      return url;
    }
    return this;
  }])
  .config(['$compileProvider', function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https|mailto|whatsapp|http):/);
    $compileProvider.debugInfoEnabled(false);
  }])
  .config(['$cookiesProvider', function($cookiesProvider){
    $cookiesProvider.defaults.secure = true;
  }])
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-',
      suffix: '.json'
    });
  }])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { 
        templateUrl: 'views/report-list.html',
        controller: 'ReportListCtrl',
        resolve: {
          reports: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports");
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/reports', {
        templateUrl: 'views/report-list.html',
        controller: 'ReportListCtrl',
        resolve: {
          reports: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports");
          }]
        }
      })
      .when('/reports/:report_id', {
        templateUrl: 'views/report.html',
        controller: 'ReportCtrl',
        resolve: {
          report: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id);
          }]
        }
      })
      .when('/create-report', {
        templateUrl: 'views/report.html',
        controller: 'ReportCtrl',
        resolve: {
          report: function(){return null}
        }
      })
      .when('/reports/:report_id/retention-guide', {
        templateUrl: 'views/retention-guide.html',
        controller: 'RetentionGuideCtrl',
        resolve: {
          report: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id);
          }],
          guide: ["$route", "dataProviderService", "urls", "envOptions", "$q", function($route, dataProviderService, urls, envOptions, $q) {
            // Get guide for report and create if not existing
            return $q(function(resolve, reject){
              dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/retention_guide")
              .then(function(guide){
                if(!guide){
                  dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/retention_guide", {}, {})
                  .then(function(guide){
                    resolve(guide);
                  })
                  .catch(function(err){
                    reject(err);
                  })
                }
                else{
                  resolve(guide);
                }
              })
              .catch(function(err){
                reject(err);
              })
            })
          }]
        }
      })
      .when('/categories', {
        templateUrl: 'views/category-list.html',
        controller: 'CategoryListCtrl',
        resolve: {
          categories: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories");
          }]
        }
      })
      .when('/categories/:category_id', {
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl',
        resolve: {
          category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories/" + $route.current.params.category_id);
          }],
          items: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories/" + $route.current.params.category_id + "/data-items");
          }]
        }
      })
      .when('/create-category', {
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl',
        resolve: {
          category: function(){return null},
          items: function(){return null}
        }
      })
      .when('/categories/:category_id/items/:item_id', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl',
        resolve: {
          category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories/" + $route.current.params.category_id);
          }],
          item: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories/" + $route.current.params.category_id + "/data-items/" + $route.current.params.item_id);
          }]
        }
      })
      .when('/categories/:category_id/create-data-item', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl',
        resolve: {
          category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/data-categories/" + $route.current.params.category_id);
          }],
          item: function(){return null}
        }
      })
      .when('/lea-categories', {
        templateUrl: 'views/lea-category-list.html',
        controller: 'LEACategoryListCtrl',
        resolve: {
          lea_categories: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories");
          }]
        }
      })
      .when('/lea-categories/:category_id', {
        templateUrl: 'views/lea-category.html',
        controller: 'LEACategoryCtrl',
        resolve: {
          lea_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories/" + $route.current.params.category_id);
          }],
          lea_actions: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories/" + $route.current.params.category_id + "/lea-actions");
          }]
        }
      })
      .when('/create-lea-category', {
        templateUrl: 'views/lea-category.html',
        controller: 'LEACategoryCtrl',
        resolve: {
          lea_category: function(){return null},
          lea_actions: function(){return null}
        }
      })
      .when('/lea-categories/:category_id/lea-actions/:action_id', {
        templateUrl: 'views/lea-action.html',
        controller: 'LEAActionCtrl',
        resolve: {
          lea_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories/" + $route.current.params.category_id);
          }],
          lea_action: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories/" + $route.current.params.category_id + "/lea-actions/" + $route.current.params.action_id);
          }]
        }
      })
      .when('/lea-categories/:category_id/create-lea-action', {
        templateUrl: 'views/lea-action.html',
        controller: 'LEAActionCtrl',
        resolve: {
          lea_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/lea-categories/" + $route.current.params.category_id);
          }],
          lea_action: function(){return null}
        }
      })
      .when('/reports/:report_id/lea-handbook', {
        templateUrl: 'views/lea-handbook.html',
        controller: 'LEAHandbookCtrl',
        resolve: {
          report: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id);
          }],
          handbook: ["$route", "dataProviderService", "urls", "envOptions", "$q", function($route, dataProviderService, urls, envOptions, $q) {
            // Get handbook for report and create if not existing
            return $q(function(resolve, reject){
              dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/law-enforcement-handbook")
              .then(function(handbook){
                if(!handbook){
                  dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/law-enforcement-handbook", {}, {})
                  .then(function(handbook){
                    resolve(handbook);
                  })
                  .catch(function(err){
                    reject(err);
                  })
                }
                else{
                  resolve(handbook);
                }
              })
              .catch(function(err){
                reject(err);
              })
            })
          }]
        }
      })
      .when('/gov-request-categories', {
        templateUrl: 'views/gov-request-category-list.html',
        controller: 'GovRequestCategoryListCtrl',
        resolve: {
          gov_request_categories: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories");
          }]
        }
      })
      .when('/gov-request-categories/:category_id', {
        templateUrl: 'views/gov-request-category.html',
        controller: 'GovRequestCategoryCtrl',
        resolve: {
          gov_request_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories/" + $route.current.params.category_id);
          }],
          gov_request_types: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories/" + $route.current.params.category_id + "/gov-request-types");
          }]
        }
      })
      .when('/create-gov-request-category', {
        templateUrl: 'views/gov-request-category.html',
        controller: 'GovRequestCategoryCtrl',
        resolve: {
          gov_request_category: function(){return null},
          gov_request_types: function(){return null}
        }
      })
      .when('/gov-request-categories/:category_id/gov-request-types/:type_id', {
        templateUrl: 'views/gov-request-type.html',
        controller: 'GovRequestTypeCtrl',
        resolve: {
          gov_request_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories/" + $route.current.params.category_id);
          }],
          gov_request_type: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories/" + $route.current.params.category_id + "/gov-request-types/" + $route.current.params.type_id);
          }]
        }
      })
      .when('/gov-request-categories/:category_id/create-gov-request-type', {
        templateUrl: 'views/gov-request-type.html',
        controller: 'GovRequestTypeCtrl',
        resolve: {
          gov_request_category: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-categories/" + $route.current.params.category_id);
          }],
          gov_request_type: function(){return null}
        }
      })
      .when('/gov-request-responses', {
        templateUrl: 'views/gov-request-response-list.html',
        controller: 'GovRequestResponseListCtrl',
        resolve: {
          gov_request_responses: ["dataProviderService", "urls", "envOptions", function(dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-responses");
          }]
        }
      })
      .when('/gov-request-responses/:response_id', {
        templateUrl: 'views/gov-request-response.html',
        controller: 'GovRequestResponseCtrl',
        resolve: {
          gov_request_response: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/gov-request-responses/" + $route.current.params.response_id);
          }]
        }
      })
      .when('/create-gov-request-response', {
        templateUrl: 'views/gov-request-response.html',
        controller: 'GovRequestResponseCtrl',
        resolve: {
          gov_request_response: function(){return null}
        }
      })
      .when('/reports/:report_id/gov-request-report', {
        templateUrl: 'views/gov-request-report.html',
        controller: 'GovRequestReportCtrl',
        resolve: {
          report: ["$route", "dataProviderService", "urls", "envOptions", function($route, dataProviderService, urls, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id);
          }],
          request_report: ["$route", "dataProviderService", "urls", "envOptions", "$q", function($route, dataProviderService, urls, envOptions, $q) {
            // Get handbook for report and create if not existing
            return $q(function(resolve, reject){
              dataProviderService.getItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/gov-request-report")
              .then(function(handbook){
                if(!handbook){
                  dataProviderService.putItem(urls.apiURL(), "/transparency-reports/" + $route.current.params.report_id + "/gov-request-report", {}, {})
                  .then(function(handbook){
                    resolve(handbook);
                  })
                  .catch(function(err){
                    reject(err);
                  })
                }
                else{
                  resolve(handbook);
                }
              })
              .catch(function(err){
                reject(err);
              })
            })
          }]
        }
      })
      .when('/offline', {
        templateUrl: 'views/offline.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

TransparencyApp.filter('object2Array', function() {
  return function(input) {
    return _.toArray(input);
  }
});

TransparencyApp.directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        console.log('value=',value);
        if(value === true) {
          $timeout(function() {
            element[0].focus();
            element[0].setSelectionRange(0, element[0].value.length)
          });
        }
      });
    }
  };
}]);
TransparencyApp.factory('nagSvgHelper', [
  '$timeout',
  function($timeout) {
    var svgHelper = {
      /**
       * Passes in a DOM element to use to inject SVG.
       *
       * @todo: add example
       *
       * @method getAsyncTemplate
       *
       * @param {DOMElement|[DOMElement]} elements Remote path to the template file
       */
      inject: function(elements) {
        if(window.IconicJS) {
            window.IconicJS().inject(elements);
        } else if(window.SVGInjector ) {
            window.SVGInjector(elements);
        }
      }
    }

    return svgHelper;
  }
]);
TransparencyApp.directive('nagSvg', ['$compile',
  'nagSvgHelper',
  function($compile, nagSvgHelper) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch('svgpath', function(value){
            if(scope.svgpath){
              element[0].setAttribute('data-src', scope.svgpath);
            }
            window.SVGInjector(element[0]);
        });
      },
      scope: {
        svgpath: '@'
      }
    }
  }
]);
// TransparencyApp.run(['$http', 'NavCollection', '$timeout', '$location', '$translate', 'envOptions', '$cookies', 'AMIRequest', function($http, NavCollection, $timeout, $location, $translate, envOptions, $cookies, AMIRequest){
//   // Redirect to landing page if on a dependant stage path
//   if(AMIRequest.hierarchy.indexOf($location.path().substring(1)) > -1){
//     $location.path('/');
//   }
//   var langCookie = $cookies.get('languageCode');

//   // Sanitize langCookie
//   if(langCookie){
//     langCookie = langCookie.replace(/\W/g, '');
//   }

//     console.log("cookie", langCookie);
//   if(langCookie){  
//     $translate.use(langCookie);
//     console.log($translate.use());
//   }
//   else if(navigator.language){
//     $translate.use(navigator.language.substr(0,2))
//   }
//   else{
//     $translate.use(envOptions.languageCode);
//   }

//       var stages = [
//         {
//           name: "Start",
//           path: "#/",
//           id: "start",
//           icon: "fa fa-home",
//           restricted: false,
//           className: "",
//           target: "_self"
//         },
//         {
//           name: "Operator",
//           path: "#/operator",
//           id: "operator",
//           icon: "fa fa-briefcase",
//           restricted: true,
//           className: "",
//           target: "_self"
//         },
//         {
//           name: "Questions",
//           path: "#/components",
//           id: "components",
//           icon: "fa fa-question-circle",
//           restricted: true,
//           className: "",
//           target: "_self"
//         },
//         {
//           name: "Subject",
//           path: "#/subject",
//           id: "subject",
//           icon: "fa fa-user",
//           restricted: true,
//           className: "",
//           target: "_self"
//         },
//         {
//           name: "Request",
//           path: "#/request",
//           id: "request",
//           icon: "fa fa-file-text",
//           restricted: true,
//           className: "",
//           target: "_self"
//         }
//       ];
//       angular.forEach(stages, function(item){
//         NavCollection.addNavItem(item.id, item.path, item.name, item.icon, item.restricted, item.className, item.target);
//       });
// }]);
TransparencyApp.run(['$templateCache', '$http', function($templateCache, $http) {
  $http.get('views/messages.html')
  .then(function(response) {
    $templateCache.put('status-messages', response.data);
  });
}]);
// TransparencyApp.run(['urls', 'envOptions', 'AMIRequest', 'cmsStatus', 'dataProviderService', '$interval', '$timeout', function(urls, envOptions, AMIRequest, cmsStatus, dataProviderService, $interval, $timeout) {
//    dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID)
//     .then(function(jurisdiction){
//       AMIRequest.set('jurisdiction', jurisdiction);
//       AMIRequest.markAsComplete('jurisdiction');
//     }).
//     catch(function(err){
//       console.log(err);
//     })
//   $interval(function(){
//     if(!cmsStatus.isOnline()){
//       var randomInt = Math.floor(Math.random() * (100000000 - 0)) + 0;
//       dataProviderService.request(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID, {"flag": randomInt}, 'GET', null, false)
//         .success( function(data, status, headers, config) {
//           cmsStatus.isOnline(true);
//         })
//         .error( function(data, status, headers, config) {
//           cmsStatus.isOnline(false);
//         });
//     }
//   }, 60000);
//   $timeout(function(){
//       document.getElementById("loadingScreen").className += ' faded-out';
//       $timeout(function(){
//         document.getElementById("loadingScreen").className.replace('faded-out', '');
//         document.getElementById("loadingScreen").remove();
//       }, 200);
//     }, 170);
// }]);
