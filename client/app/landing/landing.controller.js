'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', ['$scope', '$mdSidenav', 'scAuthService', '$http', 'socket', '$mdDialog', '$mdToast', '$animate', '$state', '$rootScope', 'playerService', 'groupService', 
  function ($scope, $mdSidenav, scAuthService, $http, socket, $mdDialog, $mdToast, $animate, $state, $rootScope, playerService, groupService) {

  $scope.favoriteTracks = [];

  if (scAuthService.isAuthenticated()) {
    $scope.username = scAuthService.getUsername();
    $scope.avatar_url = scAuthService.getAvatarUrl();
  }

  $scope.playerService = playerService;
  $scope.groupService = groupService;
  

  /* Watch Song Player */

  $scope.$watch('playerService.currentTime', function() {}, true);

  $scope.$watch('playerService.duration', function() {}, true);

  /* Icon Colors */

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
    }
  };


  $scope.getCurrentUserId = function() {
    return scAuthService.getUserId();
  };

  $scope.getCurrentUserName = function() {
    return scAuthService.getUsername();
  };

  $scope.getFavoriteTracks = function() {
      var id = scAuthService.getScId();
      scAuthService.getFavoriteTracks(id).then(function(tracks) {
        $scope.favoriteTracks = tracks.map(function(curVal, idx, arr) {
          return {
            title: curVal.title,
            track_url: curVal.permalink_url,
            artwork_url: curVal.artwork_url 
          }
        });
      });
  };

  $scope.likeSong = function(trackId) {
    scAuthService.likeTrack(trackId).
      then(function(result) {
        //Successfully Liked
        $scope.getFavoriteTracks();
      }, function(reason) {
        //Failed to Like
      });
  };


  /* Toast Logic for Adding Groups */

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
        .content('You created the playlist '+ groupName)
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

  $scope.showRemoveGroup = function(ev) {
    var confirm = $mdDialog.confirm()
      .title('Would you like unfollow ' + groupService.selectedGroup.name + '?')
      .ariaLabel('Remove Playlist')
      .ok('Remove Playlist')
      .cancel('Cancel')
      .targetEvent(ev);

    $mdDialog.show(confirm).then(function() {
      var userID = scAuthService.getUserId();
      var userName = scAuthService.getUsername();
      var isContributor = groupService.isContributor(userID, groupService.selectedGroup)
      if (isContributor) {
        groupService.removeUser('contributors', userID);
      } else {
        groupService.removeUser('followers', userID);
      }
    }, function() {
      //$scope.alert = 'You did not delete the group';
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
  AddGroupController.$inject = ['$scope', '$mdDialog', 'groupService'];

  /* Group Search */

  $scope.showSearchGroups = function(ev) {
      //console.log('we are getting here');
      $scope.groups = groupService.searchGroups();
      return $scope.groups;
  };

  // $scope.openRightMenu = function() {
  //   $mdSidenav('right').toggle();
  // };

  /* Auth */
  
  $scope.isAuthenticated = function() {
    return scAuthService.isAuthenticated();
  };

  $scope.logout = function() {
    scAuthService.logout();
  };


  /* Toggle Right Sidenav */
  $scope.toggleFavorites  = function() {
    $mdSidenav('favorites').toggle().then(function(){
      // console.log('hi');
    });
  };

}]);
