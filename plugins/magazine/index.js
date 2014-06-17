var Path = require('path');
var _ = require('lodash');
var Marked = require('marked');
Marked.setOptions({
  breaks: true
});
var Resources = require('df-resources');
var Api = require('df-api-client');



function createUrlHelper(urls, request) {
  var helper = {
    start: function() {
      return '/';
    },
    classification: function(cls) {
      return '/' + cls.slug;
    },
    tag: function(tag) {
      return '/tags/' + tag.slug;
    },
    article: function(cls, article) {
      return '/' + cls.slug + '/' + article.slug;
    },
    image: function(image, size) {
      if (!image.file) return '';
      var imgUrl = image.file.url;
      if (image.file) {
        if (image.file.sizes[size]) {
          imgUrl = image.file.sizes[size];
        }
        else if (image.file.sizes.x) {
          imgUrl = image.file.sizes.x;
        }
        return urls.images + '/' + imgUrl;
      }
    },
    asset: function(item) {
      return urls.assets + '/' + item;
    }
  };
  if (request) {
    helper.current = function() {
      return request.path;
    };
    helper.full = function() {
      return urls.magazine + request.path;
    };
    helper.articleFull = function(cls, article) {
      return urls.magazine + '/' + cls.slug + '/' + article.slug;
    };
    helper.classificationFull = function(cls) {
      return urls.magazine + '/' + cls.slug;
    };
    helper.rss = function(cls) {
      return urls.magazine + '/rss' + (cls ? '/' + cls.slug : '');
    };
  }
  return helper;
}



function init(plugin, config, api, resources, next) {

  var selection = plugin.select('web');
  var urls = {
      // these are served from different hosts/ports
      images: config.urls.static + '/images',
      assets: config.urls.web + '/static/assets',
      magazine: config.urls.web
  };
  plugin.log(['magazine'], 'paths: ' + JSON.stringify(urls));

  var app = {
    debug: config.debug,
    urls: createUrlHelper(urls),
    api: api,
    resources: resources,

    replyView: function(request, reply, viewName, context, options) {
      return reply.view(viewName, _.merge(context, {
        debug: app.debug,
        markdown: Marked,
        formatDate: function(str) {
          var date = new Date(str);
          var dd = date.getDate();
          var MM = date.getMonth() + 1;
          var yy = date.getFullYear();
          return dd + '.' + MM + '.' + yy;
        },
        urls: createUrlHelper(urls, request)
      }), options);
    }
  };


  // configure views
  plugin.views({
    path: 'views',
    engines: {
      'jade': { module: require('jade') }
    },
    isCached: !app.debug
  });


  // routes
  var startHandler = require('./lib/handlers/start-page.js')(app);
  var clsHandler = require('./lib/handlers/cls-page.js')(app);
  var tagHandler = require('./lib/handlers/tag-page.js')(app);
  var articleHandler = require('./lib/handlers/article-page.js')(app);
  var pageHandler = require('./lib/handlers/generic-page.js')(app);

  var mainRssHandler = require('./lib/handlers/main-rss.js')(app);
  var clsRssHandler = require('./lib/handlers/cls-rss.js')(app);

  selection.route([

    // start page
    {
      method: 'GET',
      path: '/',
      handler: startHandler
    },

    // category or collection page
    {
      method: 'GET',
      path: '/{classification}',
      handler: clsHandler
    },
    {
      method: 'GET',
      path: '/{classification}/',
      handler: function(request, reply) {
        reply('You are being redirected...').redirect('/' + request.params.classification);
      }
    },

    // route matching each article in either its category, or any of its collections
    // redirects to category path if article slug is valid but classification is not
    {
      method: 'GET',
      path: '/{classification}/{article}',
      handler: articleHandler
    },
    {
      method: 'GET',
      path: '/{classification}/{article}/',
      handler: function(request, reply) {
        reply('You are being redirected...').redirect('/' + request.params.classification + '/' + request.params.article);
      }
    },

    // generic pages
    {
      method: 'GET',
      path: '/s/{page}',
      handler: pageHandler
    },
    {
      method: 'GET',
      path: '/s/{page}/',
      handler: function(request, reply) {
        reply('You are being redirected...').redirect('/s/' + request.params.page);
      }
    },

    // tags
    {
      method: 'GET',
      path: '/tags/{tag}',
      handler: tagHandler
    },
    {
      method: 'GET',
      path: '/tags/{tag}/',
      handler: function(request, reply) {
        reply('You are being redirected...').redirect('/tags/' + request.params.tag);
      }
    },

    // main rss
    {
      method: 'GET',
      path: '/rss',
      handler: mainRssHandler
    },
    // cls rss
    {
      method: 'GET',
      path: '/rss/{classification}',
      handler: clsRssHandler
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

  //
  // error pages
  //
  selection.ext('onPreResponse', function(request, reply) {

    if (request.response.isBoom) {
      // redirect to error page
      var errorCode = request.response.code;
      var errorSlug = '';

      switch (errorCode) {
      case 403: // forbidden
      case 404: // not found
      case 500: // server error
        errorSlug = errorCode.toString();
        break;
      default:
        errorSlug = 'fehler';
        break;
      }

      plugin.log(['magazine'], 'error when ' + request.method + ' ' + request.path);
      plugin.log(['magazine'], 'redirect to error page:' + errorSlug + ', code: ' + errorCode);
      return reply('You are being redirected').redirect('/s/' + errorSlug);
    }

    return reply();
  });

  try {
    next();
  }
  catch (e) {
    console.log(e);
    console.log(e.stack);
    next(e);
  }
}



module.exports.register = function(plugin, options, next) {

  plugin.log(['magazine'], 'register');

  var api = Api(options.apiUrl, 'admin', options.apiKey);
  var config;

  api.getConfig().then(function(c) {
    config = c;
    return Resources();

  }).then(function(resDefs) {
    init(plugin, config, api, resDefs, next);

  }).fail(function(err) {
    console.log(err);
    console.log(err.stack);
    next(err);
  });
};
