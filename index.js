var Q = require('kew');
var Request = require('request');


function checkError(err, req, res, body) {
  if (err) {
    return err;
  }
  if (res.statusCode < 400) {
    return null;
  }
  var payload = typeof body === 'string' ? JSON.parse(body) : body;
  var cErr = new Error(payload.reason || 'couchdb ' + res.statusCode + ' - ' + payload.error);
  cErr.statusCode = res.statusCode,
  cErr.request = req;
  cErr.response = res;
  return cErr;
}


module.exports = function(apiUrl, apiUser, apiPass) {

  //
  // validate user account
  //
  function validateAccount(username, password) {
    var defer = Q.defer();
    var req = Request({
      url: apiUrl + '/accounts/validate',
      method: 'POST',
      auth: { user: apiUser, pass: apiPass },
      json: { username: username, password: password }

    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      defer.resolve(body);
    });
    return defer.promise;
  }

  return {
    getConfig: getConfig,
    validateAccount: validateAccount
  };
};
