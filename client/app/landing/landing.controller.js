'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $auth, scAuthService, $http, socket, Auth, $mdDialog, $mdToast, $animate, $state, $rootScope, playerService, groupService, $mdSidenav) {

if ($auth.isAuthenticated()) {
  $scope.username = scAuthService.getUsername();
}

$scope.playerService = playerService;
$scope.groupService = groupService;
$scope.Auth = Auth;

$scope.addIconColor = 'white';
$scope.playIconColor = 'white';
$scope.prevIconColor = 'white';
$scope.nextIconColor = 'white';

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
  };
};

  // *********************************
  // Internal methods
  // *********************************
  $scope.getCurrentUserId = function() {
    return Auth.getCurrentUser()._id;
  };

  $scope.getCurrentUserName = function() {
    return Auth.getCurrentUser().name;
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

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider).then(function(response) {
      //Login Success
      scAuthService.getUser().then(function(user) {
        $scope.username = user.username;
      });
    })
    .catch(function(response) {
      //Login Fail
    });
  };

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    $auth.logout();
  };

  $scope.getUser = function() {
    scAuthService.getUserId().then(function(user) {
      $scope
    });
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

});
