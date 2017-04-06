/*!
 * @(#)app.js
 * @author: Diego Guevara <diegoguevara.github.io>
 * AngularJS App Module
 */

/* global, angular */

'use strict';


/**
 * Main AngularJS module definition
 * @module app
 */
var app_ = angular.module('app', [
    'ngRoute',           // RouteProvider Directive
    'ngResource',        // Rest Api Resource Directive
    'ngSanitize',        // Data Sanitize Directive
    'appControllers',    // Application controllers module
    'appModels'          // Rest services access definition
]);


/**
 * Application Controllers definition
 */
var appControllers = angular.module('appControllers', []);

/**
 * Rest Services access module
 */
var appModels = angular.module('appModels', []);


/**
 * $routeProvider Configuration
 * @require ngRoute
 * @module config
 * @param {object} $routeProvider    {@link https://docs.angularjs.org}
 * @param {object} $locationProvider {@link https://docs.angularjs.org}
 */
app_.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('!');

    $routeProvider

    .when(
    '/',
    {
        templateUrl: 'views/home.html',
        controller: 'home_index_ctrl'
    })

    

    // Default route
    .otherwise({ redirectTo: '/' });
}]);