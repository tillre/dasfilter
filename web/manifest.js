var Path = require('path');

var env = process.env;

var manifest = {

  servers: [
    {
      host: '0.0.0.0',
      port: 8080,
      options: {
        labels: ['web'],
        router: {
          isCaseSensitive: false
        }
      }
    }
  ],

  plugins: {
    good: {
      subscribers: {
        console: ['ops', 'request', 'log', 'error']
      }
    },

    './plugins/magazine': {
      debug: env.NODE_ENV !== 'production',

      dbUrl: env.DF_DB_URL || 'http://localhost:5984/df',
      searchUrl: env.DF_SEARCH_URL || 'http://127.0.0.1:9200/df/_search',

      urls: {
        web: env.DF_WEB_URL || 'http://127.0.0.1:8080',
        static: env.DF_STATIC_URL || 'http://static.staging.dasfilter.com'
      },

      assetsDir: Path.join('static/assets')
    }
  }
};


module.exports = manifest;