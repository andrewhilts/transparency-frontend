'use strict';
var dataProviderService = angular.module('dataProviderService', []);
dataProviderService.factory('dataProviderService', ['$route', '$q', '$http', 'urls', 'cmsStatus', '$translate', function( $route, $q, $http, urls, cmsStatus, $translate ) {
    var self = {
        getItem: function (baseURL, itemPath, params, responseType) {
            // return $translate.onReady().then(function(){
                console.log(baseURL)
                return self.promiseRequest(baseURL, itemPath, params, 'GET', responseType);
            // });
        },
        postItem:  function (baseURL, itemPath, params, data, responseType) {
            return this.promiseRequest(baseURL, itemPath, params, 'POST', data, responseType);
        },
        putItem:  function (baseURL, itemPath, params, data, responseType) {
            return this.promiseRequest(baseURL, itemPath, params, 'PUT', data, responseType);
        },
        deleteItem:  function (baseURL, itemPath, params, responseType) {
            return this.promiseRequest(baseURL, itemPath, params, 'DELETE', null, responseType);
        },
        promiseRequest: function (baseURL, itemPath, params, httpMethod, data, setCache, responseType) {
            var delay = $q.defer();
            if(typeof baseURL === 'function'){
               // baseURL = baseURL($translate.use());
               baseURL = baseURL();
            }
            this.request(baseURL, itemPath, params, httpMethod, data, setCache, responseType)
            .success( function(data, status, headers, config) {
                if(urls.apiURL === baseURL && !cmsStatus.isOnline()){
                    cmsStatus.isOnline(true);
                }
                delay.resolve( data );
            }).error( function(data, status, headers, config) {
                if(urls.apiURL === baseURL){
                    cmsStatus.isOnline(false);
                }
                delay.reject( {data: data, status: status} );
            });
            return delay.promise;
        },
        request: function (baseURL, itemPath, params, httpMethod, data, setCache, responseType) {
            var itemURL;
            var options;
            var cache = false;
            if(setCache === true){
                cache = false;
            }

            itemURL = baseURL + itemPath;
            console.log(itemURL);
            if(typeof params == "undefined"){
              params = {};
            }
            if(httpMethod == 'POST'){
                cache = false;
            }
            options = {
                method: httpMethod, 
                url: itemURL, 
                params: params,
                cache: cache,
            }
            if(typeof data !== "undefined"){
                options.data = data;
            }
            if(typeof responseType !== "undefined"){
                options.responseType = responseType;
            }
            return $http(options);
        }
    };
    return self;
}]);