'use strict';

angular.module('levelsApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.levelsGroups = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
    $http.get('/api/groups').success(function(levelsGroups) {
      $scope.levelsGroups = levelsGroups;
      socket.syncUpdates('group', $scope.levelsGroups);
    });

    $scope.getCurrentUserId = function() {
      return Auth.getCurrentUser()._id;
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
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

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
    $scope.deleteGroup = function(group) {
      $http.delete('/api/groups/' + group._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('group');
    });
  });
