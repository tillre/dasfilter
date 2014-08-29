var Util = require('util');
var Path = require('path');
var Request = require('request');
var Q = require('kew');


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


exports.register = function(plugin, options, next) {

  plugin.log(['admin'], 'register');


  function validateAccount(username, password) {
    var defer = Q.defer();
    var req = Request({
      url: options.urls.api + '/accounts/validate',
      method: 'POST',
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


  var app = {
    plugin: plugin,
    selection: plugin.select('admin'),
    validateAccount: validateAccount,
    debug: options.debug,
    paths: {
      admin: options.urls.admin,
      images: options.urls.static + '/images',
      assets: options.urls.admin + '/static/assets',
      web: options.urls.web,
      templates: '/templates'
    }
  };

  plugin.log(['admin'], 'paths: ' + Util.inspect(app.paths));

  // context for views
  var viewContext = {
    paths: app.paths,
    // data passed on to the client
    clientData: {
      paths: app.paths,
      apiUrl: options.urls.api,
      apiKey: options.apiKey
    }
  };

  // cookie auth
  plugin.auth.strategy('admin-session', 'cookie', {
    password: options.cookiePassword,
    cookie: 'sid-df-admin',
    redirectTo: options.urls.admin + '/login',
    isSecure: false
  });

  // configure views
  plugin.views({
    path: __dirname + '/views',
    engines: {
      'jade': { module: require('jade') }
    },
    isCached: !app.debug
  });

  // routes
  var handlers = require('./lib/handlers.js')(app, viewContext);
  app.selection.route([

    // templates
    {
      method: 'GET',
      path: app.paths.templates + '/{name}',
      config: {
        auth: 'admin-session',
        handler: handlers.template
      }
    },

    // login
    {
      method: 'GET',
      path: '/login',
      config: {
        handler: handlers.loginGet
      }
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        handler: handlers.loginPost
      }
    },

    // logout
    {
      method: 'GET',
      path: '/logout',
      config: {
        auth: 'admin-session',
        handler: handlers.logout
      }
    },

    // index
    {
      method: 'GET',
      path: '/',
      config: {
        auth: 'admin-session',
        handler: handlers.index
      }
    },


    // static
    {
      method: 'GET',
      path: '/favicon.ico',
      handler: { file: Path.join(Path.resolve(options.assetsDir), 'favicon.ico') }
    },
    {
      method: 'GET',
      path: '/static/assets/{path*}',
      handler: {
        directory: { path: [Path.resolve(options.assetsDir)], listing: true }
      }
    }
  ]);


  try {
    next();
  }
  catch (e) {
    next(e);
  }
};


exports.register.attributes = {
  name: 'df-admin'
};