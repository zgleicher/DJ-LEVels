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
              var dropbox = document.getElementById('dropbox');
              dropbox.addEventListener('dragenter', noopHandler, false);
              dropbox.addEventListener('dragexit', noopHandler, false);
              dropbox.addEventListener('dragover', noopHandler, false);
              dropbox.addEventListener('drop', drop, false);

              function noopHandler(evt) {
                  evt.stopPropagation();
                  evt.preventDefault();
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

/*
              $http.get('/api/groups').success(function(levelsGroups) {
                $scope.groups = levelsGroups;
                socket.syncUpdates('group', $scope.groups);
              });

              $scope.$on('$destroy', function () {
                socket.unsyncUpdates('group');
              });
*/
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


              /* Show Members Functionality */ 

              $scope.showContributors = function(ev) {
                   $mdDialog.show({
                    controller: ContributorsController,
                    templateUrl: 'app/landing/landing.showContributors.html',      
                    targetEvent: ev,
                  })
                  .then(function(groupName) {
                    //$scope.showGroupToast(groupName);
                  }, function() {
                    //$scope.groupAction = 'You cancelled the create group dialog.';
                  });
                };


                function ContributorsController($scope, $mdDialog) {
                  $scope.hide = function() {
                    $mdDialog.hide();
                  };
                  $scope.cancel = function() {
                    $mdDialog.cancel();
                  };
                  $scope.finishForm = function(answer) {
                    $mdDialog.hide(answer);
                    // $scope.newGroup = answer;
                    // $scope.addGroup();
                  };

                  $scope.addContributor = function() {
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



              $scope.addContributor = function(user_id) {
                $http.put('/api/groups/' + $stateParams.groupid + '/contributors', {
                    "user_id": user_id
                });
              };

              $scope.removeContributor = function(user_id) {
                $http.delete('/api/groups/' + $stateParams.groupid + '/contributors', {
                    "user_id": user_id
                });
              };

              $scope.addFollower = function(user_id) {
                $http.put('/api/groups/' + $stateParams.groupid + '/followers', {
                    "user_id": user_id
                });
              };

              $scope.removeFollower = function(user_id) {
                $http.delete('/api/groups/' + $stateParams.groupid + '/followers', {
                    "user_id": user_id
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


            }
          }
        }
      })
  ;
  });


