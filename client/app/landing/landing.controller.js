'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', ['$scope', 'scAuthService', '$http', 'socket', '$mdDialog', '$mdToast', '$animate', '$state', '$rootScope', 'playerService', 'groupService', 
  function ($scope, scAuthService, $http, socket, $mdDialog, $mdToast, $animate, $state, $rootScope, playerService, groupService) {

if (scAuthService.isAuthenticated()) {
  $scope.username = scAuthService.getUsername();
  $scope.avatar_url = scAuthService.getAvatarUrl();
}

$scope.playerService = playerService;
$scope.groupService = groupService;


$scope.addIconColor = 'white';
$scope.playIconColor = 'white';
$scope.prevIconColor = 'white';
$scope.nextIconColor = 'white';

/* Watch Song Player */

$scope.$watch('playerService.currentTime', function() {
    
}, true);

$scope.$watch('playerService.duration', function() {
    
}, true);

$scope.setIconColor = function(icon, value) {
  switch (icon) {
    case 'add':
      $scope.addIconColor = value;
      break;
    case 'play':
      $scope.playIconColor = value;
      break;
    case 'prev':
      $scope.prevIconColor = value;
      break;
    case 'next':
      $scope.nextIconColor = value;
      break;
  }
};

  // *********************************
  // Internal methods
  // *********************************
  $scope.getCurrentUserId = function() {
    return scAuthService.getUserId();
  };

  $scope.getCurrentUserName = function() {
    return scAuthService.getUsername();
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


  /* toast logic */
  $scope.toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $scope.showGroupToast = function(groupName) {
    $mdToast.show(
      $mdToast.simple()
        .content('You created group '+ groupName)
        .position($scope.getToastPosition())
        .hideDelay(1500)
    );
  };

  $scope.showAddGroup = function(ev) {
     $mdDialog.show({
      controller: AddGroupController,
      templateUrl: 'app/landing/landing.addGroup.html',      
      targetEvent: ev,
    })
    .then(function(groupName) {
      $scope.showGroupToast(groupName);
    }, function() {
      //$scope.groupAction = 'You cancelled the create group dialog.';
    });
  };

  $scope.isAuthenticated = function() {
    return scAuthService.isAuthenticated();
  };

  $scope.logout = function() {
    scAuthService.logout();
  };

  function AddGroupController($scope, $mdDialog, groupService) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.finishForm = function(answer) {
      $mdDialog.hide(answer);
      $scope.newGroup = answer;
      $scope.addGroup();
    };

    $scope.addGroup = function() {
      if($scope.newGroup === '') { return; }
      groupService.createGroup($scope.newGroup);
      
    };
  }
  AddGroupController.$inject = ['$scope', '$mdDialog', 'groupService'];


}]);
