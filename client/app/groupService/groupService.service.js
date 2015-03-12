'use strict';

angular.module('levelsApp')
  .service('groupService', function ($http, $state, socket, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.groups;
    this.selectedGroup;

    $http.get('/api/groups').success(function(groups) {
      this.groups = groups;
      if (this.groups.length !== 0) {
        this.selectGroup(this.groups[0]);
      }
      socket.syncUpdates('group', this.groups);
    }.bind(this));


    /* Core group functions */

    this.selectGroup = function(group) {
    	this.selectedGroup = group;
    	$state.go('landing.center');
    }.bind(this);

    this.createGroup = function(name) {
    	var user = {
    		"user_id": Auth.getCurrentUser()._id,
    		"user_name": Auth.getCurrentUser().name
    	};
    	$http.post('/api/groups', {
        name: name,
        owner: user,
        contributors: [user],
        followers: [user],
      }).success(function (group) {
        this.selectGroup(group);
      }.bind(this));
    }.bind(this);

    this.deleteSelectedGroup = function() {
	    $http.delete('/api/groups/' + this.selectedGroup._id).success(function () {
	      if (this.groups.length !== 0) {
	        this.selectGroup(this.groups[0]);
	      } else {
	      	// No other groups to select
	      }
	    }.bind(this));
  	}.bind(this);


  	/* Track functions */ 

  	this.addTrack = function (track) {
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
      $http.post('/api/groups/' + this.selectedGroup._id + '/tracks', newTrack)
      .error(function(track, status) {
        console.log('error in post track: '+ status);
      });
    }.bind(this);

    this.voteTrack = function (direction, track) {
      $http.put('/api/groups/' + this.selectedGroup._id + '/tracks/' + track._id + '/vote',
        { 
          "direction": direction,
          "user_id": Auth.getCurrentUser()._id
        }
      );
    }.bind(this);

    /* User functions */

    this.addUser = function(category, user) {
      $http.put('/api/groups/' + this.selectedGroup._id + '/' + category, {
        "user_id": user._id,
        "user_name": user.name
      }).error(function(err) {
        console.log(err);
      });
    }.bind(this);

    this.removeUser = function(category, userId) {
      $http.delete('/api/groups/' + this.selectedGroup._id + '/' + category, {
        "user_id": userId
      });
    }.bind(this);

  });
