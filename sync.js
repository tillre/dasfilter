var Cores = require('cores');
var Load = require('./index.js');

var argv = process.argv.slice(2);

if (argv.length === 0 || argv.length > 1) {
  console.log('usage: node sync.js [Resource]');
}
else {
  var name = argv[0];
  Load().then(function(resources) {
    if (!resources[name]) {
      throw new Error('resource not found: ' + name);
    }
    var db = {
      url: process.env.DF_DB_URL,
      user: process.env.DF_DB_USER,
      pass: process.env.DF_DB_PASS
    };
    if (!db.url) {
      throw new Error('no db url, set env var DF_DB_URL');
    }
    console.log('syncing:', name, 'to db:', db.url);

    return Cores(db).create(name, resources[name], true);

  }).then(function(res) {
    console.log('sync success');

  }).fail(function(err) {
    console.log(err);
  });
}