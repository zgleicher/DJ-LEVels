'use strict';

angular.module('levelsApp')
  .filter('visibleGroups', ['groupService', 'scAuthService', function (groupService, scAuthService) {
    return function(allGroups){
      var visGroups = [];
      angular.forEach(allGroups, function(group){
        if(groupService.isFollower(scAuthService.getUserId(), group) || groupService.isContributor(scAuthService.getUserId(), group)){
          visGroups.push(group);
        }
      });
      return visGroups;
    };
  }]);