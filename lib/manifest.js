var Path = require('path');


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
  plugins: {}
};


// plugins

manifest.plugins['good'] = {
  subscribers: {
    console: ['ops', 'request', 'log', 'error']
  }
};

manifest.plugins[Path.resolve('plugins/magazine')] = {
  apiKey: process.env.DF_API_KEY || 'api-key',
  apiUrl: process.env.DF_API_URL || 'http://0.0.0.0:8050'
};

module.exports = manifest;
