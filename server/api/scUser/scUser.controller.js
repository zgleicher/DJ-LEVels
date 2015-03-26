var jwt = require('jwt-simple');
var moment = require('moment');
var ScUser = require('./scUser.model');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, 'SECRET');
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};

exports.me = function(req, res) {
  ScUser.findById(req.user, function(err, user) {
    res.send(user);
  })
};
