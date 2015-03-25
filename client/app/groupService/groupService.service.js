'use strict';

angular.module('levelsApp')
  .service('groupService', function ($http, $state, socket, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.groups;
    this.selectedGroup;

    $http.get('/api/groups').success(function(groups) {
      this.groups = groups;
      if (this.groups.length !== 0)
        this.selectGroup(this.groups[0]);
      else 
      	$state.go('landing.no-groups');
      socket.syncUpdates('group', this.groups, this.updateGroupState);
    }.bind(this));

    /* Core group functions */

    this.updateGroupState = function(event, item, array) {
    	if (event === 'updated' && item._id === this.selectedGroup._id)
    		this.selectedGroup = item;
    	else if (event === 'deleted' && this.groups.length > 0)
    		this.selectGroup(this.groups[0]);
    	else {
        console.log('going to no groups');
        $state.go('landing.no-groups');
      } 
    }.bind(this);

    this.selectGroup = function(group) {
    	this.selectedGroup = group;
    	$state.go('landing.center', { groupid: group._id });
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
	    $http.delete('/api/groups/' + this.selectedGroup._id);
  	}.bind(this);

  	/* Track functions */ 
  	this.getTrackScore = function (track) {
      return track.upvotes.length - track.downvotes.length;
    };

  	this.nextTrack = function() {
  		var sorted = this.selectedGroup.tracks.sort(function (a, b) {
  			return this.getTrackScore(a) - this.getTrackScore(b);
  		}.bind(this));
  		if (!this.selectedGroup.selectedTrack) {
  			this.selectedGroup.selectedTrack = sorted[0];
  		} else {
  			var index = sorted.indexOf(this.selectedGroup.selectedTrack);
  			this.selectedGroup.selectedTrack = index < sorted.length - 1 ? sorted[index + 1] : sorted[0];
  		}
  		return this.selectedGroup.selectedTrack;
  	}.bind(this);

  	this.addTrack = function (track) {
      track.artwork_url !== null ?
          track.artwork_url.replace('"', '') : '';
      var artURL = track.artwork_url !== null ?
      		track.artwork_url.replace('-large', '-t500x500') : '';

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

    this.deleteTrack = function (track) {
      console.log('deleting track');
      $http.delete('/api/groups/' + this.selectedGroup._id + '/tracks/' + track._id)
      .error(function(track, status) {
        console.log('error in delete track: '+ status);
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
