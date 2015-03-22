'use strict';

angular.module('levelsApp')
  .service('playerService', function (groupService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    SC.initialize({
    	client_id: '8404d653618adb5d684fa8b257d4f924'
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

    this.loadTrack = function(track, cb) {
    	if (this.isPlaying) {
    		this.currentSound.stop();
    		this.currentsound = '';
    		this.isPlaying = false;
    	}  
    	this.currentTrack = track;
    	SC.stream('/tracks/' + track.track_id, {
          whileplaying: function () {
            player.currentTime = this.position;
            console.log(player.currentTime);
          },
          onload: function () {
            player.duration = this.duration;
          }
        }, function(sound) {
          	this.currentSound = sound;
            console.log(this.currentSound);
            // this.duration = sound['durationEstimate'];
            // console.log('duration is ' + this.duration);
            // this.currentTime = sound.position;
            // console.log('current time is ' + this.currentTime);
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
  });
