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
            controller: function($scope, $stateParams){
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
              $scope.message = $stateParams.groupid; 
              //QUERY FOR TRACKS FOR THIS GROUP
              // $http.get('/api/groups/' + groupid).success(function (group) {

              //   $scope.tracks = group.tracks;
              // })
              //$scope.tracks = [{title: "Song1", details: "song blah blah"}, {title: "Song2", details: "song blaasdfh blah"}];
              $scope.tracks = [];
              $scope.$watchCollection(function (scope) { return scope.tracks }, function (newTracks, oldTracks) {
                // $scope.dataCount = newNames.length;
                console.log("Scope tracks: " + $scope.tracks);
                if(!$scope.$$phase){
                  $scope.$apply();
                }
              });

              //NEED TO CHANGE THIS TO LOAD TRACKS FOR GROUP
              // $scope.tracks = [];
              $scope.addTrack = function (track) {
                //NEED TO ADD THIS TRACK TO ACTUAL GROUP IN DB
                $scope.tracks.unshift({
                  title: track.title,
                  artist: track.user.username,
                  image_url: track.artwork_url.replace('"', '')
                });
                console.log("added track " + $scope.tracks);
                $scope.$digest();
                
              };

            
            }
          }
        }
      })
  ;
  });


