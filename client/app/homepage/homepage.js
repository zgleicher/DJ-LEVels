'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('homepage', {
        url: '/homepage',
        templateUrl: 'app/homepage/homepage.html',
        controller: 'HomepageCtrl'
      });
  });