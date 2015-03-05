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
                    console.log(track);
                    SC.get('/tracks/' + track.id + '/comments', function(comments) {
                      for (var i = 0; i < 10; i++) {
                        console.log('Someone said: ' + comments[i].body);
                      }
                    });
                  });



              }
              /* end logic for drag and drop */

              //controller for the center part, ened to extract
              console.log($stateParams);
              $scope.message = $stateParams.groupid; 
              //QUERY FOR TRACKS FOR THIS GROUP
              // $http.get('/api/groups/' + groupid).success(function (group) {

              //   $scope.tracks = group.tracks;
              // })
              $scope.tracks = [{title: "Song1", details: "song blah blah"}, {title: "Song2", details: "song blaasdfh blah"}];
              $scope.message2 = 'hello world. this is the UI-center view';
            }
          }
        }
      })
  ;
  });


