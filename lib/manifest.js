var Path = require('path');

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
  apiKey: process.env.DF_API_KEY || 'api-key',
  apiUrl: process.env.DF_API_URL || 'http://0.0.0.0:8050'
};

module.exports = manifest;
