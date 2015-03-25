'use strict';

/***************
Service can be use for autenticationg. Acutal login, logout should be done with $auth service.
Methods implemented to get the user id of the user logged in and the favorite tracks of a given user
***************/

angular.module('levelsApp')
  .service('scAuthService', function ($auth, $http, $q) {

    this.getUserId = function() {
      return $auth.getPayload().sc_id;
    }; 

    this.getUsername = function() {
      return $auth.getPayload().username;
    }

    // Gets the favorite tracks of a user given a user Id
    this.getFavoriteTracks = function(userId) {
       var deferred = $q.defer();
          $http({
            url: 'https://api.soundcloud.com/users/'+ userId + '/favorites', 
            method: 'GET',
            params: {client_id: '66fd2fb89c48bdcf4d67c15d99baf2a8'}
          })
          .then(function (response) {
            deferred.resolve(response.data);
          });

          return deferred.promise;
    }

});