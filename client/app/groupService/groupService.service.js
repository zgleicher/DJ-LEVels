'use strict';

angular.module('levelsApp')
  .service('groupService', function ($http, socket, Auth) {
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
      });
    }.bind(this);

    this.deleteGroup = function(group) {
	    var selectAnother = false;
	    if (selectedGroup === group)
	    	selectAnother = true;
	    $http.delete('/api/groups/' + group._id).success(function () {
	      if (selectAnother && this.groups.length !== 0) {
	        this.selectGroup(this.groups[0]);
	      } else if (selectAnother) {
	      	// No groups to select
	      }
	    }.bind(this));
  	}.bind(this);

  });
