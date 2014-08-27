var Path = require('path');
var env = process.env;

module.exports = function(cores, definitions) {

  var manifest = {
    servers: [
      {
        host: '0.0.0.0',
        port: process.env.DF_API_PORT || 8050,
        options: {
          labels: ['api'],
          cors: true,
          payload: {
            maxBytes: 99 * 1024 * 1024
          },
          timeout: {
            client: false
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
    plugins: {
      'hapi-auth-basic': {},

      good: {
        subscribers: {
          console: ['ops', 'request', 'log', 'error']
        }
      },

      'cores-hapi': {
        debug: env.NODE_ENV !== 'production',
        cores: cores
      },

      './plugins/api': {
        debug: env.NODE_ENV !== 'production',
        cores: cores,
        definitions: definitions,
        staticDir: Path.join('static'),
        apiKey: env.DF_API_KEY || 'api-key',
        s3Key: env.DF_S3_KEY || 'AKIAI7N2MQ6LGWWZGWEQ',
        s3Secret: env.DF_S3_SECRET || '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',
        s3Bucket: env.DF_S3_BUCKET || 'static.dev.dasfilter.com'
      }// ,

      // './plugins/static': {
      //   debug: true,
      //   staticDir: Path.resolve('static')
      // }
    }
  };

  return manifest;
};
