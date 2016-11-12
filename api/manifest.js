var Path = require('path');
var env = process.env;

module.exports = function(cores, definitions) {

  var manifest = {
    servers: [
      {
        host: '0.0.0.0',
        port: 8050,
        options: {
          labels: ['api'],
          cors: {
            additionalHeaders: ['df-user']
          },
          payload: {
            maxBytes: 100 * 1024 * 1024
          },
          timeout: {
            client: false
          }
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

        appKey: env.DF_APP_KEY || 'key',
        appSecret: env.DF_APP_SECRET || 'secret',

        s3Key: env.DF_S3_KEY || 'AKIAI7N2MQ6LGWWZGWEQ',
        s3Secret: env.DF_S3_SECRET || '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',
        s3Region: env.DF_S3_REGION || 'eu-west-1',
        s3Bucket: env.DF_S3_BUCKET || 'static.dev.dasfilter.com'
      }
    }
  };

  return manifest;
};
