var Path = require('path');
var env = process.env;

module.exports = function(cores, definitions) {
  return {
    connections: [
      {
        port: 8080,
        labels: ['api', 'admin', 'web'],
        routes: {
          cors: {
            additionalHeaders: ['df-user']
          },
          payload: {
            maxBytes: 100 * 1024 * 1024
          },
          timeout: {
            server: false
          }
        }
      }
    ],

    registrations: [
      {
        plugin: { register: 'inert' }
      },
      {
        plugin: { register: 'vision' }
      },
      {
        plugin: { register: 'hapi-auth-basic' }
      },
      {
        plugin: { register: 'hapi-auth-cookie' }
      },
      {
        plugin: {
          register: 'good',
          options: {
            ops: {
              interval: 10000
            },
            reporters: {
              console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                  log: '*',
                  request: '*',
                  ops: '*',
                  error: '*'
                }]
              }, {
                module: 'good-console'
              }, 'stdout']
            }
          }
        }
      },
      {
        plugin: {
          register: './plugins/admin',
          select: ['admin'],
          routes: {
            prefix: '/admin'
          },
          options: {
            debug: env.NODE_ENV !== 'production',

            webUrl: '/',
            staticUrl: env.DF_STATIC_URL,
            apiUrl: '/api',

            staticDir: Path.join('static'),
            imagesDir: Path.join('static/images'),
            assetsDir: Path.join('static/admin'),

            appKey: env.DF_APP_KEY,
            appSecret: env.DF_APP_SECRET,

            cookiePassword: env.DF_COOKIE_PASS
          }
        }
      },
      {
        plugin: {
          register: 'cores-hapi',
          options: {
            debug: env.NODE_ENV !== 'production',
            cores: cores
          }
        }
      },
      {
        plugin: {
          register: './plugins/api',
          select: ['api'],
          routes: {
            prefix: '/api'
          },
          options: {
            debug: env.NODE_ENV !== 'production',

            cores: cores,
            definitions: definitions,

            adminUsername: env.DF_ADMIN_USERNAME,
            adminPassword: env.DF_ADMIN_PASSWORD,

            appKey: env.DF_APP_KEY,
            appSecret: env.DF_APP_SECRET,

            s3: {
              endpoint: env.DF_S3_ENDPOINT,
              key: env.DF_S3_KEY,
              secret: env.DF_S3_SECRET,
              region: env.DF_S3_REGION,
              bucket: env.DF_S3_BUCKET,
              port: env.DF_S3_PORT
            }
          }
        }
      },
      {
        plugin: {
          register: './plugins/magazine',
          select: ['web'],
          options: {
            debug: env.NODE_ENV !== 'production',

            cores: cores,
            definitions: definitions,
            staticUrl: env.DF_STATIC_URL,
            assetsDir: Path.join('static/magazine')
          }
        }
      }
    ]
  }
}
