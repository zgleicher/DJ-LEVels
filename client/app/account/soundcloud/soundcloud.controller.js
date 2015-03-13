'use strict';

angular.module('levelsApp')
  .controller('SoundcloudCtrl', function ($scope, $auth) {
   $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function(response) {
        //Login Success
      })
      .catch(function(response) {
        //Login Fail
      });
    };

  $scope.isAuthenticated = function() {
    console.log($auth.isAuthenticated());
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    $auth.logout();
  }

  $scope.getUserId = function() {
    
  }

  });
