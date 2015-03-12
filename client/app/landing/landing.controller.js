'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $http, socket, Auth, $mdDialog, $mdToast, $animate, $state, $rootScope, playerService, groupService) {

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

$scope.nextSong = function () {
  //NEED LOGIC 
  console.log('clicked next song');
  $rootScope.$centerCtrlScope.playNext();
};

$scope.previousSong = function () {
  //NEED LOGIC 
  console.log('clicked previous song');
  $rootScope.$centerCtrlScope.playPrevious();
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
