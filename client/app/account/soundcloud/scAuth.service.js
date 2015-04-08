'use strict';

/***************
Service can be use for autenticationg. Acutal login, logout should be done with $auth service.
Methods implemented to get the user id of the user logged in and the favorite tracks of a given user
***************/

angular.module('levelsApp')
  .service('scAuthService', ['$auth', '$http', '$q', function ($auth, $http, $q) {

    this.allUsers = [];
    //populate allUsers
    //this.getAllUsers();

    this.returnAllUsersArray = function() {
      this.getAllUsers();
      return this.allUsers;
    };

    this.login = function(provider) {
      var deferred = $q.defer();
      $auth.authenticate(provider).then(function(response) {
        deferred.resolve(response);
      })
      .catch(function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };

    this.logout = function() {
      $auth.logout();
    };

    this.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    //Soundcloud User Id
    this.getScId = function() {
      return $auth.getPayload().sc_id;
    }; 

    //Soundcloud username
    this.getUsername = function() {
      return $auth.getPayload().username;
    };

    //SoundCloud token
    this.getScToken = function() {
      return $auth.getPayload().sc_token;
    };

    //Mongo User Id
    this.getUserId = function() {
      return $auth.getPayload().sub;
    };

    //Gets the full name of the logged in user
    this.getFullName = function() {
      return $auth.getPayload().full_name;
    };

    //Gets the avatar Url for the logged in user
    this.getAvatarUrl = function() {
      return $auth.getPayload().avatar_url;
    };

    //Promise that gets the current logged in User
    this.getCurrentUser = function() {
      var deferred = $q.defer();
      $http.get('/api/scusers/me').
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.reject(data);
        });

      return deferred.promise;
    };

    this.getAllUsers = function() {
      var deferred = $q.defer();
      $http.get('/api/scusers/').
        success(function(data, status, headers, config) {
          //this.allUsers = data;
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.reject(data);
        });

      return deferred.promise;
    };

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
    };

    this.likeTrack = function(trackId) {
      var deferred = $q.defer();
      var token = $auth.getPayload().sc_token;
          $http({
            url: 'https://api.soundcloud.com/me/favorites/'+ trackId, 
            method: 'PUT',
            params: {oauth_token: token}
          })
          .then(function (response) {
            deferred.resolve(response.data);
          });

          return deferred.promise;
    }



}]);
