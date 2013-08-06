'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.bootstrap.dropdownToggle',
  'ui.bootstrap.rating'

]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.

    when('/type', {
      templateUrl: 'partials/typetest',
      controller: 'termCtrl'
    }).
      when('/add', {
          templateUrl: 'partials/addContent',
          controller: "add"
      }).
    otherwise({
      redirectTo: '/type'
    });

  $locationProvider.html5Mode(true);
});
