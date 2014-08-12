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

      db: env.DF_DB_URL || 'http://localhost:5984/df',

      urls: {
        web: env.DF_WEB_URL || 'http://0.0.0.0:8080',
        static: env.DF_STATIC_URL || 'http://0.0.0.0:8060'
      },

      assetsDir: Path.join('static/assets')
    }
  }
};



// plugins

// manifest.plugins['good'] = {
//   subscribers: {
//     console: ['ops', 'request', 'log', 'error']
//   }
// };

// manifest.plugins[Path.resolve('plugins/magazine')] = {
//   debug: env.NODE_ENV !== 'production',

//   db: env.DF_DB_URL || 'http://localhost:5984/df',

//   urls: {
//     web: env.DF_WEB_URL || 'http://0.0.0.0:8080',
//     static: env.DF_STATIC_URL || 'http://0.0.0.0:8060'
//   },

//   assetsDir: Path.join('static/assets')
// };

module.exports = manifest;
