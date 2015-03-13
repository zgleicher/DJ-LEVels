'use strict';

var express = require('express');
var passport = require('passport');
var request = require('request');

var router = express.Router();

router.post('/', function(req, res) {
  var accessTokenUrl = 'https://api.soundcloud.com/oauth2/token';
  var soundcloudUserUrl = 'https://api.soundcloud.com/me.json'
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: 'e7871749b858f8d54e34a1f8f1984eba', //Should be hidden in config
    grant_type: 'authorization_code',
    redirect_uri: req.body.redirectUri
  };

  //Use the authorization code to get an access token
  request.post(accessTokenUrl, {form: params, json: true}, function(err, response, body) {
    if(!err) {
      var accessToken = body.access_token;
      var qs = {oauth_token: accessToken};
      console.log(qs);

      request.get({url: soundcloudUserUrl, qs: qs, json: true}, function(err, response, body) {
        console.log(err);
        console.log(body);
      });
    }
  });



});


module.exports = router;