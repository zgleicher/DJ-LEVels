'use strict';

angular.module('levelsApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'scAuthService', '$location', function ($scope, $http, socket, scAuthService, $location) {
    $scope.awesomeThings = [];
    $scope.levelsGroups = [];

    $scope.login = function(provider) {
      if (scAuthService.isAuthenticated()) {
        $location.path("/landing");
      } else {
        scAuthService.login(provider).then(function(response) {
          // Login success
        }, function(reason) {
          //Failed
        });
      }
    }


    $http.get('/api/groups').success(function(levelsGroups) {
      $scope.levelsGroups = levelsGroups;
      socket.syncUpdates('group', $scope.levelsGroups);
    });

    $scope.getCurrentUserId = function() {
      return scAuthService.getCurrentUserId();
    };


    $scope.addGroup = function() {
      if($scope.newGroup === '') {
        return;
      }
      $http.post('/api/groups', {
        name: $scope.newGroup,
        owner: $scope.getCurrentUserId()
      });
      $scope.newGroup = '';
    };

    $scope.deleteGroup = function(group) {
      $http.delete('/api/groups/' + group._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('group');
    });
  }]);
