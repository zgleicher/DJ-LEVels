'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope, $http, socket, Auth, $mdDialog, $mdToast, $animate, $state, $rootScope) {
 // var allMembers = [ ],
var allGroups = [ ];

//LOAD MEMBERS BASED ON GROUPS
$scope.selected      = null;
$scope.members       = [];
$scope.selectedGroup = null;
$scope.groups        = allGroups;

$scope.once = false;

$rootScope.$landingCtrlScope = $scope;


/* song player */
$scope.newTrack = false;
$scope.songIsPlaying = false;
$scope.currentTrack = undefined;
$scope.currentSound = undefined;

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

$scope.playSong = function () {
  if ($scope.newTrack && $scope.currentSound)
    $scope.currentSound.stop();
  //NEED LOGIC TO PLAY SONG
  $scope.songIsPlaying = true;
  console.log('clicked play song');
  if ($scope.newTrack) {
    SC.stream('/tracks/' + $scope.currentTrack.track_id, function(sound){
      $scope.currentSound = sound;
      $scope.currentSound.play();
    });
    $scope.newTrack = false;
  } else {
    $scope.currentSound.resume();
  }
};

$scope.pauseSong = function () {
  //NEED LOGIC 
  if ($scope.currentSound)
    $scope.currentSound.pause();
  $scope.songIsPlaying = false;
  console.log('clicked pause song');
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
    function (newGroups, oldGroups) {
      //can use newGroups, oldGroups as params later
      if ($state.someShit) {
        $state.someShit.trigger();
      }
    },
    true
  );

  

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
    $http.delete('/api/groups/' + group._id).success(function (){
      if ($scope.groups.length !== 0) {
        $scope.selectGroup($scope.groups[0]);
      }
      // ADD IN TRIGGER DUMMY PAGE FOR NO GROUPS
    });
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
      if($scope.newGroup === '') { return; }
      $http.post('/api/groups', {
        name: $scope.newGroup,
        owner: Auth.getCurrentUser()._id,
        owner_name: Auth.getCurrentUser().name,
        contributors: [{ "user_id": Auth.getCurrentUser()._id, "user_name": Auth.getCurrentUser().name }],
        followers: [{ "user_id": Auth.getCurrentUser()._id, "user_name": Auth.getCurrentUser().name }],
      }).success(function (group) {
        $rootScope.$landingCtrlScope.selectGroup(group);
      });
      $scope.newGroup = '';
    };
  }

/* Show Members Functionality
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
      if($scope.newGroup === '') { return; }
      $http.post('/api/groups', {
        name: $scope.newGroup,
        owner: Auth.getCurrentUser()._id,
        owner_name: Auth.getCurrentUser().name
      }).success(function (group) {
        $rootScope.$landingCtrlScope.selectGroup(group);
      });
      $scope.newGroup = '';
    };
  }



*/


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

  // $scope.setEditMode = function() {
  //   $scope.editMode = true;
  // };
  // $scope.cancelEditMode = function() {
  //   $scope.editMode = false;
  // };

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('thing');
    socket.unsyncUpdates('group');
  });

  //load all groups, select one
  $scope.loadGroups();
  
});
