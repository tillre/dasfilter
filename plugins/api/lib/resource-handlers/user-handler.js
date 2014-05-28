var Q = require('kew');
var Helpers = require('./helpers.js');
var Crypt = require('../crypt.js');



function hashPasswordMaybe(newDoc, oldDoc, callback) {

  if (oldDoc && newDoc.password === oldDoc.password) {
    // password is still set to the hash in the db
    return Q.resolve(newDoc);
  }

  return Crypt.hashPassword(newDoc.password).then(function(hash) {
    newDoc.password = hash;
    return newDoc;
  });
}


module.exports = function(api) {

  var resources = api.cores.resources;

  function check(doc, oldDoc) {
    return Helpers.checkUniqueness(resources.User, 'usernames', 'username', doc.username).then(function() {
      return hashPasswordMaybe(doc, oldDoc);
    });
  }


  api.pre.create('User', function(doc) {
    return check(doc);
  });


  api.pre.update('User', function(doc) {

    return resources.User.load(doc._id).then(function(oldDoc) {
      if (oldDoc.username !== doc.username) {
        return check(doc, oldDoc);
      }
      else {
        return hashPasswordMaybe(doc, oldDoc);
      }
    });
  });
};