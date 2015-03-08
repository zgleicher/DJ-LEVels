'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var async = require('async');

// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    groups.forEach(function(group) {
      group.tracks.forEach(function(track) {
        User.findById(track.submitted_by, function(err, usr) {
          track.submitted_by_name = usr ? usr.name : 'NOT FOUND';
        });
      });
    });
    console.log(groups);
    res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    return res.json(group);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  Group.create(req.body, function(err, group) {
    if(err) { console.log(err); return handleError(res, err); }
    return res.json(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.track = {
  index: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      return res.json(200, group.tracks);
    });
  },
  create: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      group.tracks.unshift(req.body);
      console.log(group.tracks[0]);
      group.save(function(err) {
        if (err) { return handleError(res, err); }
        return res.json(201, group.tracks[0]);
      });
    });
  },
  vote: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      var track = group.tracks.id(req.params.track_id);
      if (!track) return res.json(404);
      var index;
      if (req.body.direction === 'up') {
        if ((index = track.downvotes.indexOf(req.body.user_id)) !== -1)
          track.downvotes.splice(index, 1); // remove user from downvotes
        if ((index = track.upvotes.indexOf(req.body.user_id)) === -1)
          track.upvotes.push(req.body.user_id);
        else
          track.upvotes.splice(index, 1); // reset this users vote
        group.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200);
        });
      } else if (req.body.direction === 'down') {
        if ((index = track.upvotes.indexOf(req.body.user_id)) !== -1)
          track.upvotes.splice(index, 1); // remove user from upvotes
        if ((index = track.downvotes.indexOf(req.body.user_id)) === -1)
          track.downvotes.push(req.body.user_id);
        else
          track.downvotes.splice(index, 1);
        group.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200);
        });
      } else {
        return res.json(400)
      }
    })
  }
};

function handleError(res, err) {
  return res.send(500, err);
}