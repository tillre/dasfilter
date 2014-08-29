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
  plugins: {

    'hapi-auth-cookie': {},

    good: {
      subscribers: {
        console: ['ops', 'request', 'log', 'error']
      }
    },

    './plugins/admin': {
      debug: env.NODE_ENV !== 'production',

      urls: {
        web: env.DF_WEB_URL || 'http://127.0.0.1:8080',
        admin: env.DF_ADMIN_URL || 'http://127.0.0.1:8070',
        static: env.DF_STATIC_URL || 'http://static.dev.dasfilter.com.s3-website-eu-west-1.amazonaws.com',
        api: env.DF_API_URL || 'http://127.0.0.1:8050'
      },

      staticDir: Path.join('static'),
      imagesDir: Path.join('static/images'),
      assetsDir: Path.join('static/assets'),

      cookiePassword: env.DF_COOKIE_PASS || 'cookie-password'
    }
  }
};

module.exports = manifest;
