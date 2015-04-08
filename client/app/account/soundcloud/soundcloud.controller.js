'use strict';

/*****************
// This controller demnstrates how the user information will be used. $auth functions 
// should be attached to the appropriate controllers. 
// Check out the api for Satellizer https://github.com/sahat/satellizer
*****************/

angular.module('levelsApp')
  .controller('SoundcloudCtrl', ['$scope', '$auth', 'scAuthService', '$http', function ($scope, $auth, scAuthService, $http) {
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
      var id = scAuthService.getScId();
      scAuthService.getFavoriteTracks(id).then(function(tracks) {
        $scope.tracks = tracks.map(function(curVal, idx, arr) {
          return {
            title: curVal.title,
            track_url: curVal.permalink_url,
            artwork_url: curVal.artwork_url 
          }
        });
      });
  };

  $scope.test = function() {
    // scAuthService.getUserId();
    // console.log($auth.getPayload());
    // console.log($auth.getToken());
    // $http.get('/api/scUsers/').
    //   success(function(data, status, headers, config) {
    //     console.log(data);
    //     // this callback will be called asynchronously
    //     // when the response is available
    //   }).
    //   error(function(data, status, headers, config) {
    //     console.log('fail');
    //     // called asynchronously if an error occurs
    //     // or server returns response with an error status.
    //   });

    scAuthService.likeTrack(142930066).
      then(function(result) {
        console.log(result);
        console.log("success");
      }, function(reason) {
        console.log(reason);
        console.log("fail");
      });

  };

  }]);
