'use strict';

angular.module('levelsApp')
  .service('groupService', ['$http', '$state', 'socket', 'scAuthService', '$q', function ($http, $state, socket, scAuthService, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var gs = this;
    this.groups;
    this.selectedGroup;

    $http.get('/api/groups').success(function(allGroups) {
      this.groups = allGroups.filter(function (g) {
        if(gs.isGroupVisible(g)){
          return true;
        } else {
          return false;
        }
      });
      if (this.groups.length !== 0) {
        this.selectGroup(this.groups[0]);
      } else {
      	$state.go('landing.no-groups');
      }
      socket.syncUpdates('group', this.groups, this.updateGroupState);
    }.bind(this));

    /* Core group functions */

    this.updateGroupState = function(event, item, array) {
    	if ((event === 'updated' || event === 'created') && item._id === this.selectedGroup._id) {
    		this.selectedGroup = item;
      } else if (event === 'deleted' && this.groups.length > 0) {
    		this.selectGroup(this.groups[0]);
      } else if (this.groups.length > 0) {
        console.log(event)
        console.log(item)
        this.selectGroup(this.groups[0]);
      } else {
        $state.go('landing.no-groups');
      } 
    }.bind(this);

    this.selectGroup = function(group) {
    	this.selectedGroup = group;
    	$state.go('landing.center', { groupid: group._id });
    }.bind(this);

    this.createGroup = function(name) {
    	var user = {
    		"user_id": scAuthService.getUserId(),
    		"user_name": scAuthService.getUsername(),
        "avatar_url": scAuthService.getAvatarUrl()
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

   this.searchGroups = function() {

      $state.go('landing.search-groups');
      console.log('searching for groups');

      this.groups;
      console.log('getting all groups');

      $http.get('/api/groups/').success(function(allGroups) {
        this.groups = allGroups;
        console.log(this.groups);
      }.bind(this));
      return this.groups;
    }.bind(this);

  this.showAllGroups = function() {
      this.groups;
      console.log('getting all groups');

      $http.get('/api/groups/').success(function(allGroups) {
        this.groups = allGroups;
        console.log(this.groups);
      }.bind(this));
    return this.groups;
  }.bind(this);

  this.getAllGroups = function() {
      var deferred = $q.defer();
      $http.get('/api/groups/').
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.reject(data);
        });

      return deferred.promise;
    };

  	/* Track functions */ 
  	this.getTrackScore = function (track) {
      return track.upvotes.length - track.downvotes.length;
    };

  	this.nextTrack = function() {
  		var sorted = this.selectedGroup.tracks.sort(function (a, b) {
  			return this.getTrackScore(b) - this.getTrackScore(a);
  		}.bind(this));
      console.log(sorted);
  		if (!this.selectedGroup.selectedTrack) {
  			this.selectedGroup.selectedTrack = sorted[0];
  		} else {
  			var index = sorted.indexOf(this.selectedGroup.selectedTrack);
  			this.selectedGroup.selectedTrack = index < sorted.length - 1 ? sorted[index + 1] : sorted[0];
  		}
  		return this.selectedGroup.selectedTrack;
  	}.bind(this);

    this.previousTrack = function() {
      //sort based on votes
      var sorted = this.selectedGroup.tracks.sort(function (a, b) {
        return this.getTrackScore(b) - this.getTrackScore(a);
      }.bind(this));

      //select first element if nothing is sorted
      if (!this.selectedGroup.selectedTrack) {
        this.selectedGroup.selectedTrack = sorted[0];
      } else {
        var index = sorted.indexOf(this.selectedGroup.selectedTrack);
        this.selectedGroup.selectedTrack = index === 0 ? sorted[0] : sorted[index - 1];
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
        submitted_by: scAuthService.getUserId(),
        submitted_by_name: scAuthService.getUsername(),
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
          "user_id": scAuthService.getUserId()
        }
      );
    }.bind(this);

    /* User functions */

    this.addUser = function(category, user) {
      $http.put('/api/groups/' + this.selectedGroup._id + '/' + category, {
        "user_id": user._id,
        "user_name": user.username,
        "avatar_url": user.avatar_url
      }).error(function(err) {
        console.log(err);
      });
    }.bind(this);

    this.removeUser = function(category, userId) {
      $http.delete('/api/groups/' + this.selectedGroup._id + '/' + category, {
        "user_id": userId
      });
    }.bind(this);


    this.isFollower = function(user_id, group) {
      for (var i = 0; i < group.followers.length; i++) {
        if (group.followers[i].user_id === user_id) {
          return true;
        }
      }
      return false;
    };

    this.isContributor = function(user_id, group) {
      for (var i = 0; i < group.contributors.length; i++) {
        if (group.contributors[i].user_id === user_id) {
          return true;
        }
      }
      return false;
    };

    this.isGroupVisible = function(group) {
      return this.isFollower(scAuthService.getUserId(), group) || this.isContributor(scAuthService.getUserId(), group);
    }.bind(this);

  }]);
