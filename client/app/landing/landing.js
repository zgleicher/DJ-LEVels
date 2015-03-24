'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      })
      .state('landing.no-groups', {
        url: '/landing/no-groups',
        templateUrl: 'app/landing/landing.noGroups.html',
        controller: function() {
          console.log('test');
        }
      })
      .state('landing.center', {
        url: '/center/:groupid',
        views: {
          'center-content': {
            templateUrl: 'app/landing/landing.center.html',
            controller: function($scope, $stateParams, $http, Auth, $state, $rootScope, $mdDialog, playerService, groupService, $interval){


              $scope.playerService = playerService;
              $scope.currentTime = playerService.currentTime;
              $scope.duration = playerService.duration;
              $scope.progressValue = 0;

              $rootScope.$centerCtrlScope = $scope;

              /* Watch Player Values */
              // $scope.$watch(function (){
              //     return playerService.currentTime;
              //   }, function(newValue, oldValue) {
              //     $scope.currentTime = newValue;
              //     console.log('updated currentTime');
              //   }, true);

              $scope.$watch(function() {
                  return playerService.duration;
                }, function(newValue, oldValue) {
                  $scope.duration = newValue;
                  console.log('updated duration');
              }, true);

              /* */
              $scope.updateTimer = function() {
                console.log('CLICKED UPDATE TIMER');
                $interval(function(){
                  $scope.currentTime = playerService.currentTime;
                  $scope.progressValue = playerService.currentTime / playerService.duration * 100;
                  console.log('updating timer');
                },500);
              };

              $scope.playPrevious = function() {
                var index;
                for (var i = 0; i < $scope.group.tracks.length; i++) {
                  if ($scope.group.tracks[i].track_id === $scope.currentTrack.track_id) {
                    index = i;
                    break;
                  }
                }
                if (index !== 0)
                  $scope.playSong($scope.group.tracks[index - 1]);
              };



              /* Drag and Drop Functionality + Button Positioning */
              $('#dropzone').dragster({
                  enter: function (dragsterEvent, event) {
                    /* adjust for scrolling down in center content */
                    var t = parseInt($('.md-sidenav-left').css('height'), 10)/2 - $('#dropHere').height()/2;
                    var newTop = t + $('#testingScroll').scrollTop();
                    $('#dropHere').css('top', newTop);
                    /* show overlay box */
                    $('#overlayBox').removeClass('visuallyhidden');
                    $scope.draggingSong = true;
                  },
                  leave: function (dragsterEvent, event) {
                    $('#overlayBox').addClass('visuallyhidden');
                    $scope.draggingSong = false;
                  },
                  drop: function (dragsterEvent, event) {
                    event.stopPropagation();
                    event.preventDefault(); 
                    $('#overlayBox').addClass('visuallyhidden');
                    var track_url = event.dataTransfer.getData('URL');
                    SC.get('/resolve', { url: track_url }, function(track) {
                      groupService.addTrack(track);
                    });
                  }
              }); 

              /* Edit and Delete Group Functionality */

              $scope.editMode = false;

              $scope.isOwner = function(group) {
                console.log(group.owner);
                console.log(Auth.getCurrentUser());

                return group.owner.user_id === Auth.getCurrentUser()._id;
              }

              /* Delete Group Confirmation */

              $scope.showDeleteGroup = function(ev) {
                var confirm = $mdDialog.confirm()
                  .title('Would you like to delete your group ' + groupService.selectedGroup.name + '?')
                  .content('All of your songs and members will be lost!')
                  .ariaLabel('Lucky day')
                  .ok('Delete group')
                  .cancel('Cancel')
                  .targetEvent(ev);

                $mdDialog.show(confirm).then(function() {
                  //$scope.alert = 'You deleted the group.';
                  groupService.deleteSelectedGroup();
                }, function() {
                  //$scope.alert = 'You did not delete the group';
                });
              };

              /* Information Tabs */

              $scope.tabData = {
                selectedIndex : 0,
              };

              $scope.next = function() {
                $scope.tabData.selectedIndex = Math.min($scope.tabData.selectedIndex + 1, 2) ;
              };

              $scope.previous = function() {
                $scope.tabData.selectedIndex = Math.max($scope.tabData.selectedIndex - 1, 0);
              };

              $scope.sizeTab = function(size) {
                var height, tpheight;
                if (size === 'tall') {
                  height = 400;
                  tpheight = 250;
                  console.log('tall');
                } else if (size === 'regular') {
                  height = 350;
                  tpheight = 200;
                  console.log('reg');
                } else if (size === 'short') {
                  height = 250;
                  tpheight = 100;
                  console.log('short');
                } else {
                  height = 200;
                  tpheight = 100;
                  console.log('catch alll ');
                }

                $('#gbox').css('height', height + 'px');

                $('.tabpanel-container').css('height', tpheight + 'px');
                console.log(height + ' , ' + tpheight);
              };

              /* Autocomplete for Adding Users */

              $scope.autocompleteUsers = {
                'isDisabled': false,
                'noCache': false,
                'selectedItem': null,
                'searchText': null,
                'querySearch': function (query) {
                  if (query) {
                    var members = Auth.getAllUsersSummary();
                    console.log(members);
                    return members.filter(function (user) {
                      var userName = angular.lowercase(user.name);
                      var lowercaseQuery = angular.lowercase(query);
                      return (userName.indexOf(lowercaseQuery) > -1);
                    });

                  } else {
                    // return $scope.getAllUsersSummary();
                    return [];
                  }
                },
                'simulateQuery': true,
              };

              /* Voting Colors */

              $scope.upColor = function(track) {
                if (track.upvotes.indexOf(Auth.getCurrentUser()._id) !== -1)
                  return 'orange'
                else
                  return 'black'
              };

              $scope.downColor = function(track) {
                if (track.downvotes.indexOf(Auth.getCurrentUser()._id) !== -1)
                  return 'orange'
                else
                  return 'black'
              };

              // $('.song-detail').on('timeupdate', function() {
              //   player.currentTime = audio.currentTime;
              //   player.duration = audio.duration;
              // }, false);
            }
          }
        }
      })
  ;
  });


