'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      })
      .state('landing.center', {
        url: '/center/:groupid',
        views: {
          'center-content': {
            templateUrl: 'app/landing/landing.center.html',
            controller: function($scope, $stateParams){
              //controller for the center part, ened to extract
              console.log($stateParams);
              $scope.message = $stateParams.groupid; 
              $scope.message2 = 'hello world. this is the UI-center view';
            }
          }
        }
      })
  ;
  });