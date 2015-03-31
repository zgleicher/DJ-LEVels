'use strict';

angular.module('levelsApp')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);