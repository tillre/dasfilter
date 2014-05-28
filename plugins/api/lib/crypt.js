var Bcrypt = require('bcrypt');
var Q = require('kew');


//
// Hash a password
//
exports.hashPassword = function(pass) {

  var defer = Q.defer();
  Bcrypt.genSalt(10, function(err, salt) {
    if (err) return defer.reject(err);
    Bcrypt.hash(pass, salt, function(err, hash) {
      if (err) return defer.reject(err);
      return defer.resolve(hash);
    });
  });
  return defer.promise;
};

//
// compare password with hash
//
exports.comparePassword = function(password, hash) {
  var defer = Q.defer();
  Bcrypt.compare(password, hash, function(err, match) {
    if (err) return defer.reject(err);
    if (!match) return defer.reject(new Error('password does not match'));
    return defer.resolve();
  });
  return defer.promise;
};
