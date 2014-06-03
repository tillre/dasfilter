var Path = require('path');
var Config = require('./config.js');

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
  debug: Config.debug,
  db: Config.db
};

manifest.plugins[Path.resolve('plugins/api')] = {
  debug: Config.debug,
  config: Config
};

manifest.plugins[Path.resolve('plugins/static')] = {
  debug: true,
  staticDir: Path.resolve(Config.staticDir)
};

module.exports = manifest;
