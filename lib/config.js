var Path = require('path');

var env = process.env;

module.exports = {
  debug: env.NODE_ENV !== 'production',

  db: {
    url: env.DF_DB_URL || 'https://sesame.cloudant.com/df-dev',
    user: env.DF_DB_USER || 'ionicksmanotindifewheasi',
    pass: env.DF_DB_PASS || 'FLquIYP4OlfIWGcVNvEL7yGs'
  },
  // db: 'http://localhost:5984/df',

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
