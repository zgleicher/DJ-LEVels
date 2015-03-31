'use strict';

angular.module('levelsApp')
  .service('playerService', ['groupService', '$rootScope', function (groupService, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    SC.initialize({
    	client_id: '8404d653618adb5d684fa8b257d4f924'
        // client_id: '66fd2fb89c48bdcf4d67c15d99baf2a8'
    });

    var player = this;
    this.currentSound;
    this.currentTime;
    this.duration;
    this.currentTrack;
    this.isPlaying = false;
    this.isPaused = false;

    this.togglePlay = function() {
    	if (this.isPlaying) {
    		this.currentSound.pause();
    		this.isPaused = true;
    		this.isPlaying = false;
    	} else if (this.isPaused) {
    		this.currentSound.resume();
    		this.isPaused = false;
    		this.isPlaying = true;
    	} else if (this.currentSound) {
    		this.currentSound.play();
    		this.isPaused = false;
    		this.isPlaying = true;
    	} else {
    		this.playTrack(groupService.nextTrack());
    	}
    }.bind(this);

    this.playNext = function() {
    	this.playTrack(groupService.nextTrack());
    }.bind(this);

    this.playPrevious = function() {
        this.playTrack(groupService.previousTrack());
    }.bind(this);

    this.loadTrack = function(track, cb) {
    	if (this.isPlaying) {
    		this.currentSound.stop();
    		this.currentsound = '';
    		this.isPlaying = false;
    	}  
    	this.currentTrack = track;
        //reset
        this.duration = 0;
        this.currentTime = 0;
    	SC.stream('/tracks/' + track.track_id, {
          whileplaying: function () {
            player.currentTime = this.position;
          },
          onload: function () {
            player.duration = this.duration;
          },
          whileloading: function() {
            player.duration = this.durationEstimate;
          }
        }, function(sound) {
          	this.currentSound = sound;
          	return cb(null);
    	}.bind(this));
    }.bind(this);

    this.playTrack = function(track) {
        if (track === this.currentTrack) {
            this.togglePlay();
        } else {
            this.loadTrack(track, function(err) {
                this.togglePlay();
            }.bind(this));
        }
    	
    }.bind(this);

    this.isCurrentTrackPlaying = function(track) {
        return this.currentTrack === track && this.isPlaying;
    }.bind(this);

    this.isCurrentTrack = function(track) {
        return this.currentTrack === track;
    }.bind(this);
  }]);
