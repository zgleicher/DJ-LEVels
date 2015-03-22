'use strict';
// Filter to convert milliseconds to hours, minutes, seconds
angular.module('levelsApp')
  .filter('prettyTime', function () {
    return function(value) {
      var totalSeconds = Math.floor(value / 1000),
          hours = Math.floor(totalSeconds / 3600),
          mins = '0' + Math.floor((totalSeconds % 3600) / 60),
          secs = '0' + Math.floor((totalSeconds % 60));
          mins = mins.substr(mins.length - 2);
          secs = secs.substr(secs.length - 2);
      if(!isNaN(secs)){
        if (hours){
          return hours+':'+mins+':'+secs;  
        } else {
          return mins+':'+secs;  
        };
      } else {
        return '00:00';
      };
    };
  });
