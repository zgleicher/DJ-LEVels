'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $http, socket, Auth, $mdDialog, $mdToast, $animate, $state) {
 // var allMembers = [ ],
var allGroups = [ ];

//LOAD MEMBERS BASED ON GROUPS
$scope.selected      = null;
$scope.members       = [];
$scope.selectedGroup = null;
$scope.groups        = allGroups;

$scope.once = false;
/* keep track of when you are in edit groups mode */
$scope.editMode = false;
$scope.editIconUrL = 'client/assets/icons/ic_mode_edit_24px.svg';

/* song player */
$scope.songIsPlaying = false;

$scope.playSong = function () {
  //NEED LOGIC TO PLAY SONG
  $scope.songIsPlaying = true;
  console.log('clicked play song');
};

$scope.pauseSong = function () {
  //NEED LOGIC 
  $scope.songIsPlaying = false;
  console.log('clicked pause song');
};

$scope.nextSong = function () {
  //NEED LOGIC 
  console.log('clicked next song');
};

$scope.previousSong = function () {
  //NEED LOGIC 
  console.log('clicked previous song');
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
      if (levelsGroups.length !== 0) {
        $scope.selectGroup(levelsGroups[0]);
      }
    });
  };

  //scope.groups is updated by socket whenever any (deep) change to groups happens,
  //whenever a group change happens, trigger inside of CenterCtrl */ 
  //POSSIBLE OPTIMIZATION: only reload / trigger changed group
  $scope.$watch(
    function (scope) { return scope.groups; }, 
    function () {
      //can use newGroups, oldGroups as params later
      if ($state.someShit) {
        $state.someShit.trigger();
      }
    }, 
    true);

  /**
  * Hide or Show the sideNav area
  * @param menuId
  */
  // $scope.toggleSideNav = function( name ) {
  //   $mdSidenav(name).toggle();
  // };


  $scope.selectMember = function ( member ) {
    $scope.selected = angular.isNumber(member) ? $scope.members[member] : member;
    $scope.toggleSidenav('left');
  };

  $scope.selectGroup = function ( group ) {
    //console.log(group);
    $scope.selectedGroup = angular.isNumber(group) ? $scope.groups[group] : group;
    //$scope.toggleSidenav('left');
    //load members for that group
    $scope.loadMembers(group);
    $state.go('landing.center', { groupid: group._id });
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
  };

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

  var $parentScope = $scope;
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
      }).success(function(newGroup) {
        $parentScope.selectGroup(newGroup);
      });
      $scope.newGroup = '';
    };
  }

$scope.showDeleteGroup = function(ev, group) {
  var confirm = $mdDialog.confirm()
    .title('Would you like to delete your group ' + group.name + '?')
    .content('All of your songs and members will be lost!')
    .ariaLabel('Lucky day')
    .ok('Delete group')
    .cancel('Cancel')
    .targetEvent(ev);

  $mdDialog.show(confirm).then(function() {
    $scope.alert = 'You deleted the group.';
    $scope.deleteGroup(group);
  }, function() {
    $scope.alert = 'You did not delete the group';
  });
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

  /* manage editing of groups */
  $scope.setEditMode = function() {
    $scope.editMode = true;
  };
  $scope.cancelEditMode = function() {
    $scope.editMode = false;
  };

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('thing');
    socket.unsyncUpdates('group');
  });

  //load all groups, select one
  $scope.loadGroups();
  
});
