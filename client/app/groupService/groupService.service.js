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

  });
