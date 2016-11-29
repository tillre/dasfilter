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

  function validateAccount(request, username, password) {
    var defer = Q.defer();
    var req = Request({
      url: options.apiUrl + '/accounts/validate',
      method: 'POST',
      auth: { user: options.appKey, pass: options.appSecret },
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

  var prefix = plugin.realm.modifiers.route.prefix;

  var app = {
    validateAccount: validateAccount,
    debug: options.debug,
    paths: {
      admin: prefix,
      login: prefix + '/login'
    }
  };

  // context for views
  function viewContext(request) {
    var server = 'http://' + request.info.host;
    return {
      paths: {
        admin: prefix,
        assets: prefix + '/static/assets',
        login: prefix + '/login',
        logout: prefix + '/logout',
        web: options.webUrl
      },
      // data passed on to the client
      clientData: {
        paths: {
          templates: prefix + '/templates',
          images: options.staticUrl + '/images',
          web: options.webUrl
        },
        apiUrl: server + options.apiUrl,
        appKey: options.appKey,
        appSecret: options.appSecret
      }
    };
  }

  // cookie auth
  plugin.auth.strategy('admin-session', 'cookie', false, {
    password: options.cookiePassword,
    cookie: 'sid-df-admin',
    redirectTo: '/admin/login',
    isSecure: false
  });

  plugin.views({
    engines: { jade: require('jade') },
    path: __dirname + '/views',
    isCached: !options.debug
  });

  // routes
  var handlers = require('./lib/handlers.js')(app, viewContext);
  plugin.route([

    // templates
    {
      method: 'GET',
      path: '/templates/{name}',
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
