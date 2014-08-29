var Path = require('path');
var env = process.env;

module.exports = function(cores, definitions) {

  var manifest = {
    servers: [
      {
        host: '127.0.0.1',
        port: 8050,
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
      }
    ],
    plugins: {
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
        s3Key: env.DF_S3_KEY || 'AKIAI7N2MQ6LGWWZGWEQ',
        s3Secret: env.DF_S3_SECRET || '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',
        s3Bucket: env.DF_S3_BUCKET || 'static.dev.dasfilter.com'
      }
    }
  };

  return manifest;
};
