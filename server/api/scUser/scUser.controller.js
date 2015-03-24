var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
var scUser = require('../user.model');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(Token, 'e7871749b858f8d54e34a1f8f1984eba');
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};


exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, 'e7871749b858f8d54e34a1f8f1984eba');
};

exports.me = function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  })
};
