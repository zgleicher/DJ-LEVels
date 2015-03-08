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
//router.delete('/:id/tracks/:track_id', controller.track.destroy);
router.put('/:id/tracks/:track_id/vote', controller.track.vote);

module.exports = router;