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
            controller: function($scope, $stateParams, $http, Auth, $state){
                SC.initialize({
                  client_id: '8404d653618adb5d684fa8b257d4f924'
                });

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
              /* end logic for drag and drop */
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
              // console.log('this happened');
              $http.get('/api/groups/' + $stateParams.groupid).success(function (group) {
                for (var track in group.tracks) {
                  if (group.tracks.hasOwnProperty(track)) {
                    var uid = group.tracks[track].submitted_by;
                    $http.get('/api/users/' + uid + '/name').success(function (usr) {
                      group.tracks[track].submitted_by_name = usr.name;
                      console.log(usr.name);
                    });
                    if (!group.tracks[track].submitted_by_name) {
                      group.tracks[track].submitted_by_name = 'someone';
                    }
                  }
                }
                $scope.group = group;
                $scope.tracks = group.tracks;
// <<<<<<< HEAD
//               })

//               // $scope.$watchCollection(function (scope) { return scope.tracks }, function (newTracks, oldTracks) {
//               //   if(!$scope.$$phase){
//               //     $scope.$apply();
//               //   }
// =======
// >>>>>>> b1a7df44862b548ddcb48ebc9e45f38c4c4b10b0
              });
              $scope.trigger = function() {
                $http.get('/api/groups/' + $stateParams.groupid).success(function (group) {
                  for (var track in group.tracks) {
                    if (group.tracks.hasOwnProperty(track) && !group.tracks[track].submitted_by_name) {
                      var uid = group.tracks[track].submitted_by;
                      $http.get('/api/users/' + uid + '/name').success(function (usr) {
                        group.tracks[track].submitted_by_name = usr.name;
                        console.log(usr.name);
                      });
                      if (!group.tracks[track].submitted_by_name) {
                        group.tracks[track].submitted_by_name = 'someone';
                      }
                    }
                  }
                  $scope.group = group;
                  $scope.tracks = group.tracks;
                });
              };
              
              $state.someShit = $scope;

              $scope.addTrack = function (track) {
                var newTrack = {
                  track_url: track.title,
                  title: track.title,
                  artist: track.user.username,
                  submitted_by: Auth.getCurrentUser()._id,
                  image_url: track.artwork_url !== null ?
                    track.artwork_url.replace('"', '') : ''
                };

                // Update group object in db
                $http.post('/api/groups/' + $scope.group._id + '/tracks', newTrack).success(function (track) {
                  track.submitted_by_name = Auth.getCurrentUser().name;
                  $scope.tracks.unshift(track);
                  console.log("added track");
                });
              };

            
            }
          }
        }
      })
  ;
  });


