'use strict';

angular.module('levelsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngMaterial',
  'material.components.autocomplete',
  'ngAria',
  'ngMdIcons',
  'satellizer'
])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }])

  .factory('authInterceptor', ['$rootScope', '$q', '$cookieStore', '$location', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .factory('SC', ['$window', function ($window) {
    return $window.SC;
  }])

  .run(['$rootScope', '$location', 'scAuthService', function ($rootScope, $location, scAuthService) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if(!scAuthService.isAuthenticated()) {
        $location.path('/');
      }
      // Auth.isLoggedInAsync(function(loggedIn) {
      //   if (next.authenticate && !loggedIn) {
      //     $location.path('/');
      //   }
      // });
    });
  }]);