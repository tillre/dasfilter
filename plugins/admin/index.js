var Util = require('util');
var Path = require('path');
var Request = require('request');
var Api = require('df-api-client');


function init(plugin, config, api, next) {

  var app = {
    plugin: plugin,
    selection: plugin.select('admin'),
    api: api,
    debug: config.debug,
    paths: {
      admin: config.urls.admin,
      images: config.urls.static + '/images',
      assets: config.urls.admin + '/static/assets',
      web: config.urls.web,
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
      apiUrl: config.urls.api,
      apiKey: config.apiKey
    }
  };

  // cookie auth
  plugin.auth.strategy('admin-session', 'cookie', {
    password: config.cookiePassword,
    cookie: 'sid-df-admin',
    redirectTo: config.urls.admin + '/login',
    isSecure: false
  });

  // configure views
  plugin.views({
    path: 'views',
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
        auth: { mode: 'try', strategy: 'admin-session' },
        handler: handlers.loginGet
      }
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        auth: { mode: 'try', strategy: 'admin-session' },
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
      handler: { file: Path.join(Path.resolve(config.assetsDir), 'favicon.ico') }
    },
    {
      method: 'GET',
      path: '/static/assets/{path*}',
      handler: {
        directory: { path: [Path.resolve(config.assetsDir)], listing: true }
      }
    }
  ]);


  try {
    next();
  }
  catch (e) {
    next(e);
  }
}


module.exports.register = function(plugin, options, next) {

  plugin.log(['admin'], 'register');

  var api = Api(options.apiUrl, 'admin', options.apiKey);

  api.getConfig().then(function(config) {
    init(plugin, config, api, next);
  }, function(err) {
    next(err);
  });
};
