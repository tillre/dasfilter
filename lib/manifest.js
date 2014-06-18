var Path = require('path');

module.exports = function(config, cores) {

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
    debug: config.debug,
    cores: cores
  };

  manifest.plugins[Path.resolve('plugins/api')] = {
    debug: config.debug,
    config: config
  };

  manifest.plugins[Path.resolve('plugins/static')] = {
    debug: true,
    staticDir: Path.resolve(config.staticDir)
  };

  return manifest;
};
