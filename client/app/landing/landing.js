'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
      // .state('landing.center', {
      //   views: {
      //     'center': {
      //       templateUrl: 'app/landing/landing.center.html',
      //       controller: function($scope){ $scope.message = 'hello world.'}
      //     }
      //   }
      // })
  //;
  });