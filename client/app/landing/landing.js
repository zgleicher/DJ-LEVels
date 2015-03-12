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
              /* soundcloud initializtion */
              // SC.initialize({
              //   client_id: '8404d653618adb5d684fa8b257d4f924'
              // });
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

              /* logic for drag and drop */
             // var dropzone = document.getElementById( "dropzone" );
              // console.log(dropzone);
              // var dragster = new Dragster( dropzone );
              // document.addEventListener( "dragster:enter", function (e) {
              //   e.target.classList.add( "dragged-over" );
              // }, false );

              // document.addEventListener( "dragster:leave", function (e) {
              //   e.target.classList.remove( "dragged-over" );
              // }, false );

              // dropzone.on("drop", function (event) {
              //   evt.stopPropagation();
              //   evt.preventDefault(); 
              //   var track_url = evt.dataTransfer.getData('URL');
                
              //   //make api call to soundcloud, populate data, add track to tracks
              //   SC.get('/resolve', { url: track_url }, function(track) {
              //     $scope.addTrack(track);
              //   });
              //   dragster.dragleave(event);
              // });
              $('#dropzone').dragster({
                  enter: function (dragsterEvent, event) {
                      $('#overlayBox').addClass('overlay');
                      $('#overlayBox').removeClass('visuallyhidden');
                      $scope.draggingSong = true;
                  },
                  leave: function (dragsterEvent, event) {
                      $('#overlayBox').removeClass('overlay');
                      $('#overlayBox').addClass('visuallyhidden');
                      $scope.draggingSong = false;
                  },
                  drop: function (dragsterEvent, event) {
                      event.stopPropagation();
                      event.preventDefault(); 
                      $('#overlayBox').removeClass('overlay');
                      $('#overlayBox').addClass('visuallyhidden');
                      var track_url = event.dataTransfer.getData('URL');
                      SC.get('/resolve', { url: track_url }, function(track) {
                        groupService.addTrack(track);
                      });
                  }
              });
              // var dropbox = document.getElementById('dropzone');
              // dropbox.addEventListener('dragenter', enter, false);
              // dropbox.addEventListener('dragleave', exit, false);
              // dropbox.addEventListener('dragover', noopHandler, false);
              // dropbox.addEventListener('drop', drop, false);
              // $scope.draggingSong = false;

              // function noopHandler(evt) {
              //     evt.stopPropagation();
              //     evt.preventDefault();
              // }
              // function enter(evt) {
              //   $scope.draggingSong = true;
              //    console.log('dragging');
              // }
              // function exit(evt) {
              //   $scope.draggingSong = false;
              //   console.log('leaving');
              // }
              // function drop(evt) {
              //     evt.stopPropagation();
              //     evt.preventDefault(); 
              //     var track_url = evt.dataTransfer.getData('URL');
                  
              //     //make api call to soundcloud, populate data, add track to tracks
                  // SC.get('/resolve', { url: track_url }, function(track) {
                  //   $scope.addTrack(track);
                  // });
              // }



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
              /* Show Members Functionality */ 

              // $scope.showContributors = function(ev) {
              //      $mdDialog.show({
              //       controller: ContributorsController,
              //       templateUrl: 'app/landing/landing.showContributors.html',      
              //       targetEvent: ev,
              //     })
              //     .then(function(groupName) {
              //       //$scope.showGroupToast(groupName);
              //     }, function() {
              //       //$scope.groupAction = 'You cancelled the create group dialog.';
              //     });
              //   };


              //   function ContributorsController($scope, $mdDialog) {
              //     $scope.hide = function() {
              //       $mdDialog.hide();
              //     };
              //     $scope.cancel = function() {
              //       $mdDialog.cancel();
              //     };
              //     $scope.finishForm = function(answer) {
              //       $mdDialog.hide(answer);
              //       // $scope.newGroup = answer;
              //       // $scope.addGroup();
              //     };

              //     $scope.addContributor = function() {
              //       if($scope.newGroup === '') { return; }
              //       $http.post('/api/groups', {
              //         name: $scope.newGroup,
              //         owner: Auth.getCurrentUser()._id,
              //         owner_name: Auth.getCurrentUser().name
              //       }).success(function (group) {
              //         $rootScope.$landingCtrlScope.selectGroup(group);
              //       });
              //       $scope.newGroup = '';
              //     };
              //   }

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


