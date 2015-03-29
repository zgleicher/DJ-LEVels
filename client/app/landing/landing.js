'use strict';

angular.module('levelsApp')
  .config(['$stateProvider', function ($stateProvider) {
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
            controller: function($scope, $stateParams, $http, $state, $rootScope, $mdDialog, playerService, groupService, $interval, scAuthService){


              $scope.playerService = playerService;
              $scope.currentTime = playerService.currentTime;
              $scope.duration = playerService.duration;
              $scope.progressValue = 0;

              // $scope.clear = function () {
              //   $mdAutocompleteCtrl.clear();
              // };

              $rootScope.$centerCtrlScope = $scope;

              /* Watch Contributors and Followers for Selected Group */

              $scope.$watch(function() { 
                return groupService.selectedGroup.contributors; 
              }, function () {
                //console.log('contributors changed');
              }, true);

              $scope.$watch(function() { 
                return groupService.selectedGroup.followers; 
              }, function () {
                //console.log('followers changed');
              }, true);

              /* Watch Player Values */

              $scope.$watch(function() {
                  return playerService.duration;
                }, function(newValue, oldValue) {
                  $scope.duration = newValue;
                 // console.log('updated duration');
              }, true);

              $scope.updateTimer = function() {
                $interval(function(){
                  $scope.currentTime = playerService.currentTime;
                  $scope.progressValue = playerService.currentTime / playerService.duration * 100;
                 // console.log('updating timer');
                },500);
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
                    console.log(event);
                    
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
              };

              /* Delete Group Confirmation */

              $scope.showDeleteGroup = function(ev) {
                var confirm = $mdDialog.confirm()
                  .title('Would you like to delete your group ' + groupService.selectedGroup.name + '?')
                  .content('All of your songs and members will be lost!')
                  .ariaLabel('Delete Group')
                  .ok('Delete group')
                  .cancel('Cancel')
                  .targetEvent(ev);

                $mdDialog.show(confirm).then(function() {
                  groupService.deleteSelectedGroup();
                }, function() {
                  //$scope.alert = 'You did not delete the group';
                });
              };

              /* Delete Track Confirmation */

              $scope.showDeleteTrack = function(ev, track) {
                var confirmTrack = $mdDialog.confirm()
                  .title('Would you like to delete the track ' + track.title + '?')
                  .content(track.title + ' will be removed from ' + groupService.selectedGroup.name + '.')
                  .ariaLabel('Delete track')
                  .ok('Delete track')
                  .cancel('Cancel')
                  .targetEvent(ev);

                $mdDialog.show(confirmTrack).then(function() {
                  groupService.deleteTrack(track);
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

              /* Adjust height of Tabs for content */

              $scope.sizeTab = function(size) {
                var height, tpheight;
                if (size === 'tall') {
                  height = 400;
                  tpheight = 250;
                } else if (size === 'regular') {
                  height = 350;
                  tpheight = 200;
                } else if (size === 'short') {
                  height = 250;
                  tpheight = 100;
                } else {
                  height = 200;
                  tpheight = 100;
                }

                $('#gbox').css('height', height + 'px');
                $('.tabpanel-container').css('height', tpheight + 'px');
              };

              /* Autocomplete for Adding Users */

              $scope.autocompleteUsers = {
                'isDisabled': false,
                'noCache': false,
                'selectedItem': null,
                'searchText': null,
                'querySearch': function (query) {
                  if (query) {
                    return scAuthService.getAllUsers().then(function(members){
                      //console.log(members);
                      return members.filter(function (user) {
                        var userName = angular.lowercase(user.username);
                        var lowercaseQuery = angular.lowercase(query);
                        return (userName.indexOf(lowercaseQuery) > -1);
                      });
                    });
                    

                  } else {
                    return [];
                  }
                },
                'simulateQuery': true,
                'selectedItemChange': function() {
                  console.log('changed');
                }
              };

              /* Voting Colors */

              $scope.upColor = function(track) {
                if (track.upvotes.indexOf(Auth.getCurrentUser()._id) !== -1) {
                  return 'orange';
                }
                else {
                  return 'black';
                }
              };

              $scope.downColor = function(track) {
                if (track.downvotes.indexOf(Auth.getCurrentUser()._id) !== -1) {
                  return 'orange';
                }
                else {
                  return 'black';
                }
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
  }]);


