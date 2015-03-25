'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scUserSchema = new mongoose.Schema({
  sc_id: Number,
  username: String
});

module.exports = mongoose.model('ScUser', scUserSchema);