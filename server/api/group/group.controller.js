'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var async = require('async');

// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if (err) { return handleError(res, err); }
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
      User.findById(req.body.user_id, function(err, usr) {
        if (err) { return handleError(res, err); }
        if (!usr) return res.json(404);

        if (req.body.direction === 'up') {
          if ((index = track.downvotes.indexOf(req.body.user_id)) !== -1)
            track.downvotes.splice(index, 1); // remove user from downvotes
          if ((index = track.upvotes.indexOf(req.body.user_id)) === -1)
            track.upvotes.push(req.body.user_id);
          else
            track.upvotes.splice(index, 1); // reset this users vote
          group.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(204);
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
            return res.json(204);
          });
        } else {
          return res.json(400)
        }
      });
      
    })
  },

  putContributor: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      User.findById(req.body.user_id, function(err, usr) {
        if (err) { return handleError(res, err); }
        if (!usr) return res.json(404);

        if (group.contributors.indexOf(req.body.user_id) === -1) {
          group.contributors.push(req.body.user_id);
          return res.json(204);
        }

        return res.json(400);
      });
    });
  },

  delContributor: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      var index;
      if ((index = group.contributors.indexOf(req.body.user_id)) !== -1) {
        group.contributors.splice(index, 1);
        return res.json(204);
      }
      else
        return res.json(404);
    });
  },

  putFollower: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      User.findById(req.body.user_id, function(err, usr) {
        if (err) { return handleError(res, err); }
        if (!usr) return res.json(404);

        if (group.followers.indexOf(req.body.user_id) === -1) {
          group.followers.push(req.body.user_id);
          return res.json(204);
        }

        return res.json(400);
      });
    });
  },

  delFollower: function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) { return handleError(res, err); }
      var index;
      if ((index = group.followers.indexOf(req.body.user_id)) !== -1) {
        group.followers.splice(index, 1);
        return res.json(204);
      }
      else
        return res.json(404);
    });
  }

};

function handleError(res, err) {
  return res.send(500, err);
}