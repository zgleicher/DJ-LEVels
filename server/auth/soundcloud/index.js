'use strict';

var express = require('express');
var passport = require('passport');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var ScUser = require('../../api/scUser/scUser.model.js')

var router = express.Router();

router.post('/', function(req, res) {
  var accessTokenUrl = 'https://api.soundcloud.com/oauth2/token';
  var soundcloudUserUrl = 'https://api.soundcloud.com/me.json'
  var params = {
    code: req.body.code,
    //local
    client_id: req.body.clientId,
    client_secret: 'e7871749b858f8d54e34a1f8f1984eba', //Should be hidden in config
    //production
    // client_id: '8404d653618adb5d684fa8b257d4f924',
    // client_secret: '856bdb4e4537ce97b5de9b95bc90ed26',
    grant_type: 'authorization_code',
    redirect_uri: req.body.redirectUri
  };

  //Use the authorization code to get an access token
  request.post(accessTokenUrl, {form: params, json: true}, function(err, response, body) {
    if(!err) {
      var accessToken = body.access_token;
      var qs = {oauth_token: accessToken};

      //Use access token to get user info
      request.get({url: soundcloudUserUrl, qs: qs, json: true}, function(err, response, user) {
        if (!err) {
          var sc_id = user.id;
          var username = user.username;
          var full_name = user.full_name;
          var avatar_url = user.avatar_url;
          ScUser.findOne({'sc_id': sc_id}, function (err, existingUser) {
            if (existingUser) {
              return res.send({ token: createToken(existingUser) });
            } else {
              var user = new ScUser();
              user.sc_id = sc_id;
              user.username = username;
              user.full_name = full_name;
              user.avatar_url = avatar_url;

              user.save(function(err) {
                console.log(user);
                var token = createToken(user);
                res.send({ token: token });
              });
            }

          });
        }
      });
    }
  });
});

var createToken = function (user) {
  var payload = {
    sub: user._id,
    sc_id: user.sc_id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, 'SECRET');
};

module.exports = router;