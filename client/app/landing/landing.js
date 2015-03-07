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
            controller: function($scope, $stateParams, $http, Auth){
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
                  
                  //MAKE API CALL TO SOUNDCLOUD, populate data, add track to tracks
                  SC.get('/resolve', { url: track_url }, function(track) {
                    //console.log(track);
                    $scope.addTrack(track);
                  });
              }
              /* end logic for drag and drop */

              //controller for the center part, need to extract
              //console.log($stateParams);

              //QUERY FOR TRACKS FOR THIS GROUP
              $http.get('/api/groups/' + $stateParams.groupid).success(function (group) {
                $scope.group = group;
                $scope.tracks = group.tracks;
              })

              $scope.$watchCollection(function (scope) { return scope.tracks }, function (newTracks, oldTracks) {
                if(!$scope.$$phase){
                  $scope.$apply();
                }
              });

              //NEED TO CHANGE THIS TO LOAD TRACKS FOR GROUP
              $scope.addTrack = function (track) {
                $scope.tracks.unshift({
                  track_id: track.title,
                  name: track.title,
                  artist: track.user.username,
                  submitted_by: Auth.getCurrentUser()._id,
                  image_url: track.artwork_url.replace('"', '')
                });


                // Update group object in db
                $scope.group.tracks = $scope.tracks;
                $http.put('/api/groups/' + $scope.group._id, $scope.group).success(function () {
                  //$scope.$digest();
                  console.log("added track " + $scope.tracks);
                });


                
                
              };

            
            }
          }
        }
      })
  ;
  });


