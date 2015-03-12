'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      })
      .state('landing.center', {
        url: '/center/:groupid',
        views: {
          'center-content': {
            templateUrl: 'app/landing/landing.center.html',
            controller: function($scope, $stateParams, $http, Auth, $state, $rootScope, $mdDialog){
              /* soundcloud initializtion */
              SC.initialize({
                client_id: '8404d653618adb5d684fa8b257d4f924'
              });

              $rootScope.$centerCtrlScope = $scope;

              $scope.playNext = function() {
                var index;
                for (var i = 0; i < $scope.group.tracks.length; i++) {
                  if ($scope.group.tracks[i].track_id === $scope.currentTrack.track_id) {
                    index = i;
                    break;
                  }
                }
                if (index !== $scope.group.tracks.length - 1)
                  $scope.playSong($scope.group.tracks[index + 1]);
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

              /* logic for drag and drop */
              var dropbox = document.getElementById('dragzone');
              dropbox.addEventListener('dragenter', enter, false);
              dropbox.addEventListener('dragleave', exit, false);
              dropbox.addEventListener('dragover', noopHandler, false);
              dropbox.addEventListener('drop', drop, false);

              function noopHandler(evt) {
                  evt.stopPropagation();
                  evt.preventDefault();
              }
              function enter(evt) {
                 console.log('dragging');
              }
              function exit(evt) {
                console.log('leaving');
              }
              function drop(evt) {
                  evt.stopPropagation();
                  evt.preventDefault(); 
                  var track_url = evt.dataTransfer.getData('URL');
                  
                  //make api call to soundcloud, populate data, add track to tracks
                  SC.get('/resolve', { url: track_url }, function(track) {
                    $scope.addTrack(track);
                  });
              }

              $scope.dropboxHover = false;

              //NEED TO ADD google drive functionality for hovering (blue circle as the target)
              $scope.hovering = function (bool) {
                if (bool === true) {
                  $scope.dropboxHover = true;
                } else {
                  $scope.dropboxHover = false;
                }
              };

              $scope.isHovering = function () {
                return $scope.dropboxHover;
              };

              /* song play logic */

              $scope.playSong = function (track) {
                console.log('playing track ' + track.title);
                $scope.currentTrack = track;
                $rootScope.$landingCtrlScope.currentTrack = track;
                $rootScope.$landingCtrlScope.newTrack = true;
                $rootScope.$landingCtrlScope.playSong();
                //NEED TO ADD LOGIC HERE!
              };

              //QUERY FOR TRACKS FOR THIS GROUP
              $http.get('/api/groups/' + $stateParams.groupid).success(function (group) {
                $scope.group = group;
                $scope.tracks = group.tracks;
              });

              $scope.trigger = function() {
                $http.get('/api/groups/' + $stateParams.groupid).success(function (group) {
                  $scope.group = group;
                  $scope.tracks = group.tracks;
                  $rootScope.$landingCtrlScope.currentTrack = group.tracks[0];
                });
              };
              
              $state.someShit = $scope;

              /* Edit and Delete Group Functionality */

              $scope.editMode = false;

              $scope.isOwner = function() {
                console.log($scope.group);
                return $scope.group.owner === Auth.getCurrentUser()._id;
              }

              /* Delete Group Confirmation */

              $scope.showDeleteGroup = function(ev) {
                var confirm = $mdDialog.confirm()
                  .title('Would you like to delete your group ' + $scope.group.name + '?')
                  .content('All of your songs and members will be lost!')
                  .ariaLabel('Lucky day')
                  .ok('Delete group')
                  .cancel('Cancel')
                  .targetEvent(ev);

                $mdDialog.show(confirm).then(function() {
                  //$scope.alert = 'You deleted the group.';
                  $rootScope.$landingCtrlScope.deleteGroup($scope.group);
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

              //default to closed
              $scope.contributorsOpen = false;
              $scope.followersOpen = false;

              // $scope.showContributors = function() {
              //   $scope.contributorsOpen = true;
              //   $scope.followersOpen = false;
              // };

              // $scope.hideContributors = function() {
              //   $scope.contributorsOpen = false;
              //   $scope.followersOpen = false;
              // };

              // $scope.showFollowers = function() {
              //   $scope.contributorsOpen = false;
              //   $scope.followersOpen = true;
              // };

              // $scope.hideFollowers = function() {
              //   $scope.contributorsOpen = false;
              //   $scope.followersOpen = false;
              // };


              $scope.tabData = {
                selectedIndex : 0,
              };

              $scope.tabNext = function() {
                $scope.tabData.selectedIndex = Math.min($scope.tabData.selectedIndex + 1, 2) ;
              };
              $scope.previous = function() {
                $scope.tabData.selectedIndex = Math.max($scope.tabData.selectedIndex - 1, 0);
              };


                // function ContributorsController($scope, $mdDialog) {
                //   $scope.hide = function() {
                //     $mdDialog.hide();
                //   };
                //   $scope.cancel = function() {
                //     $mdDialog.cancel();
                //   };
                //   $scope.finishForm = function(answer) {
                //     $mdDialog.hide(answer);
                //     // $scope.newGroup = answer;
                //     // $scope.addGroup();
                //   };

                //   $scope.addContributor = function() {
                //     if($scope.newGroup === '') { return; }
                //     $http.post('/api/groups', {
                //       name: $scope.newGroup,
                //       owner: Auth.getCurrentUser()._id,
                //       owner_name: Auth.getCurrentUser().name
                //     }).success(function (group) {
                //       $rootScope.$landingCtrlScope.selectGroup(group);
                //     });
                //     $scope.newGroup = '';
                //   };
                // }
              $scope.getAllUsersSummary = function() {
                var callback = function (array) {
                  console.log('hi in callback: ' + array);
                };
                Auth.getAllUsersSummary(callback);
                // return members;
                // return [
                // { "value": 
                //   { 
                //     "name": 'Noureen',
                //     "_id": '1234',
                //     "email": 'nan2130@columbia.edu'
                //   },
                //   "display": 'Noureen'
                // },
                // { "value": 
                //   { 
                //     "name": 'Kristie',
                //     "_id": '14924',
                //     "email": 'kbh2120@columbia.edu'
                //   },
                //   "display": 'Kristie'
                // },
                // {
                //   "value": {
                //     "name": 'kristie howard',
                //     '_id': '54fe69ec3bf6ce6bddfd93ec',
                //     "email": 'kristiehow@gmail.com'
                //   },
                //   "display": 'kristie howard'
                // }];
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

                  //   var callback = function (array) {
                  //     console.log('hi in cb, array is this long: ' + array.length);
                  //     console.log(array[0]);
                  //     var filtered = array.filter(function (user) {
                  //       var userName = angular.lowercase(user.name);
                  //       var lowercaseQuery = angular.lowercase(query);
                  //       return (userName.indexOf(lowercaseQuery) > -1);
                  //     });
                  //     console.log('FILTERED ARRAY is this long: ' + filtered.length);
                  //     console.log(filtered[0]);
                  //     return filtered;
                  //   };
                    
                  //   return Auth.getAllUsersSummary(callback);

                  } else {
                    // return $scope.getAllUsersSummary();
                    return [];
                  }
                },
                'simulateQuery': true,
              };

              $scope.addContributor = function(user) {
                console.log('adding contributor ' + user.name);
                $http.put('/api/groups/' + $stateParams.groupid + '/contributors', {
                    "user_id": user._id,
                    "user_name": user.name
                }).success(function(data) {
                  console.log('hi from success put: ' + data);
                  console.log($scope.group.contributors);
                }).error(function(err) {
                  console.log(err);
                });
              };
              //SHOULD ADD A CONTRIBUTOR TO  FOLLOWERS TOO

              $scope.removeContributor = function(userId) {
                $http.delete('/api/groups/' + $stateParams.groupid + '/contributors', {
                    "user_id": userId
                });
              };

              $scope.addFollower = function(userId, userName) {
                $http.put('/api/groups/' + $stateParams.groupid + '/followers', {
                    "user_id": userId,
                    "user_name": userName
                });
              };

              $scope.removeFollower = function(userId) {
                $http.delete('/api/groups/' + $stateParams.groupid + '/followers', {
                    "user_id": userId
                });
              };

 

              /* Track Voting */

              $scope.upvoteTrack = function (track) {
                $http.put('/api/groups/' + $scope.group._id + '/tracks/' + track._id + '/vote',
                  { 
                    "direction": "up",
                    "user_id": Auth.getCurrentUser()._id
                  }
                );
              };

              $scope.downvoteTrack = function (track) {
                $http.put('/api/groups/' + $scope.group._id + '/tracks/' + track._id + '/vote',
                  { 
                    "direction": "down",
                    "user_id": Auth.getCurrentUser()._id
                  }
                );
              };

              $scope.getVotes = function (track) {
                return track.upvotes.length - track.downvotes.length;
              };


              $scope.addTrack = function (track) {
                track.artwork_url !== null ?
                    track.artwork_url.replace('"', '') : '';
                var artURL = track.artwork_url.replace('-large', '-t500x500');
                var newTrack = {
                  track_id: track.id,
                  track_url: track.permalink_url,
                  title: track.title,
                  artist: track.user.username,
                  submitted_by: Auth.getCurrentUser()._id,
                  submitted_by_name: Auth.getCurrentUser().name,
                  image_url: artURL
                };

                // Update group object in db
                $http.post('/api/groups/' + $scope.group._id + '/tracks', newTrack)
                .success(function (track) {
                  track.submitted_by_name = Auth.getCurrentUser().name;
                  $scope.tracks.unshift(track);
                })
                .error(function(track, status) {
                  console.log('error in post track: '+ status);
                });
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


