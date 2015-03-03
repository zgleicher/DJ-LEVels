'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $http, socket, Auth) {
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

  $scope.addGroup = function() {
    if($scope.newGroup === '') {
      return;
    }
    $http.post('/api/groups', {
      name: $scope.newGroup,
      owner: $scope.getCurrentUserId()
    });
    $scope.newGroup = '';
  };

  $scope.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };
  $scope.deleteGroup = function(group) {
    $http.delete('/api/groups/' + group._id);
  };

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
