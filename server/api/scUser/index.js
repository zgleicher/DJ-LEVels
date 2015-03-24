'use strict';

var express = require('express');
var controller = require('./scUser.controller.js');

var router = express.Router();

router.get('/me', controller.ensureAuthenticated, controller.me);

module.exports = router;