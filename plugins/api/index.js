var Hapi = require('hapi');
var Path = require('path');
var Q = require('kew');
var _ = require('lodash');
var Knox = require('knox');
var File = require('./lib/file.js');
var Account = require('./lib/account.js');
var SyncWireframes = require('./lib/sync-wireframes.js');


exports.register = function(plugin, options, next) {

  plugin.log(['api'], 'register');

  // load resources and create api
  var coresHapi = plugin.plugins['cores-hapi'];
  // fn to sync layouts with categories/collections/startpage
  var syncWireframes = SyncWireframes(plugin, options.cores, options.definitions);


  // basic auth
  plugin.auth.strategy('api', 'basic', {
    validateFunc: function(username, password, callback) {
      var valid = username === options.appKey && password === options.appSecret;
      callback(null, valid, { username: username });
    }
  });


  // create api
  coresHapi.createApi({
    auth: 'api',
    selection: plugin.select('api')
  });


  var knox = Knox.createClient({
    key: options.s3Key,
    secret: options.s3Secret,
    region: options.s3Region,
    bucket: options.s3Bucket
  });

  var statics = require('./lib/statics.js')(knox);

  // load api handlers
  require('./lib/resource-handlers/user-handler.js')(coresHapi);
  require('./lib/resource-handlers/image-handler.js')(coresHapi, statics);
  require('./lib/resource-handlers/gallery-handler.js')(coresHapi);
  require('./lib/resource-handlers/article-handler.js')(coresHapi);
  require('./lib/resource-handlers/category-handler.js')(coresHapi, syncWireframes);
  require('./lib/resource-handlers/collection-handler.js')(coresHapi, syncWireframes);
  require('./lib/resource-handlers/tags-handler.js')(coresHapi);
  require('./lib/resource-handlers/contributor-handler.js')(coresHapi);
  require('./lib/resource-handlers/generic-handlers.js')(coresHapi);


  var account = Account(options.cores.resources.User);

  // validate account route
  plugin.route({
    method: 'POST',
    path: '/accounts/validate',
    config: {
      auth: 'api',
      handler: function(request, reply) {
        account.validate(request.payload.username, request.payload.password).then(function(user) {
          reply(user);
        }, function(err) {
          reply(Hapi.error.unauthorized('Unauthorized'));
        });
      }
    }
  });

  // create default admin if no user exists
  return account.maybeCreateAdmin().then(function() {
    // create missing wireframes
    return syncWireframes();
  }).then(function() {
    try {
      next();
    }
    catch (e) {
      next(e);
    }

  }).fail(function(err) {
    console.log(err);
    console.log(err.stack);
  });
};


exports.register.attributes = {
  name: 'df-api'
};
