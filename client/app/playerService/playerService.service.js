'use strict';

angular.module('levelsApp')
  .service('playerService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    SC.initialize({
    	client_id: '8404d653618adb5d684fa8b257d4f924'
    });

    this.currentSound;
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
    	}
    }.bind(this);

    this.loadTrack = function(track, cb) {
    	if (this.isPlaying) {
    		this.currentSound.stop();
    		this.currentsound = '';
    		this.isPlaying = false;
    	}
    	this.currentTrack = track;
    	SC.stream('/tracks/' + track.track_id, function(sound) {
      	this.currentSound = sound;
      	return cb(null);
    	});
    }.bind(this);

    this.playTrack = function(track) {
    	this.loadTrack(track, function(err) {
    		this.togglePlay();
    	}.bind(this));
    }.bind(this);

  });
