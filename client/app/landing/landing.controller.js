'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $http, socket, Auth, $mdDialog, $mdToast, $animate) {
 // var allMembers = [ ],
  var allGroups = [ ];

//LOAD MEMBERS BASED ON GROUPS
$scope.selected      = null;
$scope.members       = [];
$scope.selectedGroup = null;
$scope.groups        = allGroups;

  // *********************************
  // Internal methods
  // *********************************
  $scope.getCurrentUserId = function() {
    return Auth.getCurrentUser()._id;
  };
  
  /**
  * Load members for a group
  * @param menuId
  *
  */
  $scope.loadMembers = function(selectedGroup) {
    // $http.get('/api/users').success(function(allMembers) {
    //   $scope.members = allMembers;
    //   socket.syncUpdates('user', $scope.members);
    //   $scope.selected = allMembers[0];
    // });
   
    // console.log($scope.members);
    $scope.members = selectedGroup.contributors;
    //TEMP
    $scope.members = randomNum();
    //$scope.members = ['1', '2', '3', '4'];
    //socket.syncUpdates('user', $scope.members);
    // $scope.selected = allMembers[0];
    $scope.selected = $scope.members[0];
  };

  $scope.loadGroups = function() {
    $http.get('/api/groups').success(function(levelsGroups) {
      $scope.groups = levelsGroups;
      socket.syncUpdates('group', $scope.groups);
      //$scope.selectedGroup = levelsGroups[0];
      $scope.selectGroup(levelsGroups[0]);
    });
  };

  /**
  * Hide or Show the sideNav area
  * @param menuId
  */
  // $scope.toggleSideNav = function( name ) {
  //   $mdSidenav(name).toggle();
  // };

  /**
  * Select the current members
  * @param menuId
  */
  $scope.selectMember = function ( member ) {
    $scope.selected = angular.isNumber(member) ? $scope.members[member] : member;
    $scope.toggleSidenav('left');
  };

  $scope.selectGroup = function ( group ) {
    console.log(group);
    $scope.selectedGroup = angular.isNumber(group) ? $scope.groups[group] : group;
    //$scope.toggleSidenav('left');
    //load members for that group
    $scope.loadMembers(group);
  };

  $scope.addMember = function() {
    if($scope.newThing === '') {
      return;
    }
    $http.post('/api/things', { name: $scope.newThing });
    $scope.newThing = '';
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
  }

  $scope.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };
  $scope.deleteGroup = function(group) {
    $http.delete('/api/groups/' + group._id);
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

  //
  function AddGroupController($scope, $mdDialog) {
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
      if($scope.newGroup === '') {
        return;
      }
      console.log('in add group: '+ $scope.newGroup);
      $http.post('/api/groups', {
        name: $scope.newGroup,
        owner: Auth.getCurrentUser()._id
      });
      $scope.newGroup = '';
    };
  }



  function randomNum() {
    var arr = [],
    num = Math.random()*8, 
    i;
    for (i = 0; i < num; i++) {
      arr.push({ 'name': Math.round(Math.random() * 100)});
    }
    return arr;
  }

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('thing');
    socket.unsyncUpdates('group');
  });

  //load all groups, select one
  $scope.loadGroups();
  
});
