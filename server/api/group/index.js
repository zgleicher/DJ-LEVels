'use strict';

var express = require('express');
var controller = require('./group.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:id/tracks', controller.track.index);
//router.get('/:id/tracks/track_id', controller.track.show);
router.post('/:id/tracks', controller.track.create);
//router.put('/:id/tracks/:track_id', controller.track.update);
router.delete('/:id/tracks/:track_id', controller.track.destroy);
router.put('/:id/tracks/:track_id/vote', controller.track.vote);
router.put('/:id/contributors', controller.track.putContributor);
router.delete('/:id/contributors', controller.track.delContributor);
router.put('/:id/followers', controller.track.putFollower);
router.delete('/:id/followers', controller.track.delFollower);

module.exports = router;
