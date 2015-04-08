'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scUserSchema = new mongoose.Schema({
  sc_id: Number,
  username: String,
  full_name: String,
  avatar_url: String,
  sc_token: String
});

module.exports = mongoose.model('ScUser', scUserSchema);