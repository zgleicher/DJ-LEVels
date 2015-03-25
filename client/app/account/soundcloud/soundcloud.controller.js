'use strict';

/*****************
// This controller demnstrates how the user information will be used. $auth functions 
// should be attached to the appropriate controllers. 
// Check out the api for Satellizer https://github.com/sahat/satellizer
*****************/

angular.module('levelsApp')
  .controller('SoundcloudCtrl', function ($scope, $auth, scAuthService) {
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
  };

  var getUserId = function() {
    return $auth.getPayload().sc_id;
  };

  $scope.getFavoriteTracks = function() {
      var id = getUserId();
      scAuthService.getFavoriteTracks(id).then(function(tracks) {
        $scope.tracks = tracks;
      });
  };

  $scope.test = function() {
    console.log($auth.getPayload());
    console.log($auth.getToken());
  };

  });
