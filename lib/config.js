var Path = require('path');

var env = process.env;

module.exports = {
  debug: env.NODE_ENV !== 'production',

  db: env.COUCHDB_URL || 'http://127.0.0.1:5984/df',

  urls: {
    web: env.DF_WEB_URL || 'http://0.0.0.0:8080',
    admin: env.DF_ADMIN_URL || 'http://0.0.0.0:8070',
    static: env.DF_STATIC_URL || 'http://0.0.0.0:8060',
    api: env.DF_API_URL || 'http://0.0.0.0:8050'
  },

  staticDir: Path.join('static'),
  imagesDir: Path.join('static/images'),
  assetsDir: Path.join('static/assets'),

  cookiePassword: env.DF_COOKIE_PASSWORD || 'cookie-password',
  apiKey: env.DF_ADMIN_API_KEY || 'api-key'
};
