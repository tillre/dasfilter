var Assert = require('assert')
var Q = require('kew');
var J = require('jski')();
var Crypt = require('./crypt.js');

module.exports = function(userRes) {

  //
  // create admin account
  //
  function createAdmin(username, password) {
    Assert(password && password.length > 10)

    var admin = J.createValue(userRes.schema);
    admin.username = username;
    admin.role = 'admin';

    return Crypt.hashPassword(password).then(function(hash) {
      admin.password = hash;
      return admin;
    });
  }


  function maybeCreateAdmin(username, password) {
    return userRes.view('usernames', { keys: [username] }).then(function(result) {
      if (result.rows.length === 0) {
        // add default admin user
        return createAdmin(username, password).then(function(admin) {
          return userRes.save(admin).then(function(doc) {
            return doc;
          });
        });
      }
      return null;
    });
  }

  //
  // check if user account  exists and try to match passwords
  //
  function validate(username, password, callback) {
    return userRes.view('usernames', { key: username, include_docs: true }).then(function(result) {

      if (result.rows.length === 0) throw new Error('Unkown user');

      var user = result.rows[0].doc;

      return Crypt.comparePassword(password, user.password).then(function() {
        return user;
      });
    });
  }


  return {
    maybeCreateAdmin: maybeCreateAdmin,
    validate: validate
  };
};
