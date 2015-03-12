'use strict';

angular.module('levelsApp')
  .controller('SoundcloudCtrl', function ($scope, $auth) {
   $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };

  });
