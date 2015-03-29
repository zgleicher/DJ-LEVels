'use strict';
var controller = require('./scUser.controller');
var express = require('express');
var router = express.Router();

router.get('/', controller.index);
router.get('/me', controller.ensureAuthenticated, controller.me);

module.exports = router;