var Path = require('path');


exports.register = function(plugin, options, next) {

  plugin.log(['static'], 'register');

  var imagesPath = Path.join(options.staticDir, 'images');
  plugin.log(['static'], 'images path: ' + imagesPath);

  plugin.select('static').route([
    {
      method: 'GET',
      path: '/images/{path*}',
      handler: {
        directory: { path: [imagesPath], listing: options.debug }
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
  name: 'df-static'
};