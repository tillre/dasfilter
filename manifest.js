var Path = require('path');
var env = process.env;

module.exports = function(cores) {

  var manifest = {
    servers: [
      {
        host: '0.0.0.0',
        port: process.env.DF_API_PORT || 8050,
        options: {
          labels: ['api'],
          cors: true,
          payload: {
            maxBytes: 12 * 1024 * 1024
          }
        }
      },
      {
        host: '0.0.0.0',
        port: process.env.DF_STATIC_PORT || 8060,
        options: {
          labels: ['static'],
          cors: true
        }
      }
    ],
    plugins: {}
  };

  // plugins

  manifest.plugins['hapi-auth-basic'] = {};

  manifest.plugins['good'] = {
    subscribers: {
      console: ['ops', 'request', 'log', 'error']
    }
  };

  manifest.plugins['cores-hapi'] = {
    debug: env.NODE_ENV !== 'production',
    cores: cores
  };

  manifest.plugins[Path.resolve('plugins/api')] = {
    debug: env.NODE_ENV !== 'production',
    staticDir: Path.join('static'),
    imagesDir: Path.join('static/images'),
    apiKey: env.DF_API_KEY || 'api-key'
  };

  manifest.plugins[Path.resolve('plugins/static')] = {
    debug: true,
    staticDir: Path.resolve('static')
  };

  return manifest;
};
