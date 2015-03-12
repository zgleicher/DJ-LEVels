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
            controller: function($scope, $stateParams, $http, Auth, $state, $rootScope, $mdDialog, playerService, groupService){


              $scope.playerService = playerService;
              $rootScope.$centerCtrlScope = $scope;

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

              $scope.isOwner = function() {
                console.log($scope.group);
                return $scope.group.owner === Auth.getCurrentUser()._id;
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

              $scope.tabData = {
                selectedIndex : 0,
              };

              $scope.tabNext = function() {
                $scope.tabData.selectedIndex = Math.min($scope.tabData.selectedIndex + 1, 2) ;
              };

              $scope.previous = function() {
                $scope.tabData.selectedIndex = Math.max($scope.tabData.selectedIndex - 1, 0);
              };

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


            }
          }
        }
      })
  ;
  });


