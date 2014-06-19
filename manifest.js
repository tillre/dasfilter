var Path = require('path');
var env = process.env;

var manifest = {
  servers: [
    {
      host: '0.0.0.0',
      port: 8070,
      options: {
        labels: ['admin']
      }
    }
  ],
  plugins: {}
};

// plugins

manifest.plugins['hapi-auth-cookie'] = {};

manifest.plugins['good'] = {
  subscribers: {
    console: ['ops', 'request', 'log', 'error']
  }
};

manifest.plugins[Path.resolve('plugins/admin')] = {
  debug: env.NODE_ENV !== 'production',

  urls: {
    web: env.DF_WEB_URL || 'http://0.0.0.0:8080',
    admin: env.DF_ADMIN_URL || 'http://0.0.0.0:8070',
    static: env.DF_STATIC_URL || 'http://0.0.0.0:8060',
    api: env.DF_API_URL || 'http://0.0.0.0:8050'
  },

  staticDir: Path.join('static'),
  imagesDir: Path.join('static/images'),
  assetsDir: Path.join('static/assets'),

  cookiePassword: env.DF_COOKIE_PASS || 'cookie-password',
  apiKey: env.DF_API_KEY || 'api-key'
};

module.exports = manifest;
