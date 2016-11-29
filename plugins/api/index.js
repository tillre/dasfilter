var Hapi = require('hapi');
var Boom = require('boom');
var Path = require('path');
var Q = require('kew');
var _ = require('lodash');
var AWS = require('aws-sdk');
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
    // validateFunc: function(username, password, callback) {
    validateFunc: function (request, username, password, callback) {
      var valid = username === options.appKey && password === options.appSecret;
      callback(null, valid, { username: username });
    }
  });

  // var prefix = plugin.realm.modifiers.route.prefix;

  // create api
  coresHapi.createApi({
    auth: 'api',
    selection: plugin
  });

  // var knox = Knox.createClient(options.s3);
  var s3Options = {
    s3ForcePathStyle: true,
    accessKeyId: options.s3.key,
    secretAccessKey: options.s3.secret
  }
  if (options.s3.endpoint) {
    s3Options.endpoint = new AWS.Endpoint(options.s3.endpoint)
  } else if (options.s3.region) {
    s3Options.region = options.s3.region
  } else {
    throw new Error('Define either an s3 endpoint or region')
  }
  var s3Client = new AWS.S3(s3Options)
  var statics = require('./lib/statics.js')(s3Client, options.s3.bucket);

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
          reply({username: user.username, role: user.role});
        }, function(err) {
          reply(Boom.unauthorized('Unauthorized'))
        });
      }
    }
  });

  // create default admin if no user exists
  return account.maybeCreateAdmin(options.adminUsername, options.adminPassword).then(function() {
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
