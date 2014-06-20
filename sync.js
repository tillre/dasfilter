var Cores = require('cores');
var Load = require('./index.js');

var db = {
  url: process.env.DF_DB_URL,
  user: process.env.DF_DB_USER,
  pass: process.env.DF_DB_PASS
};
var argv = process.argv.slice(2);


if (argv.length === 0 || argv.length > 1) {
  console.log('usage: node sync.js [Resource]');
}
else {
  var name = argv[0];

  console.log('loading resource definitions');
  Load(db).then(function(res) {
    if (!res.definitions[name]) {
      throw new Error('resource definition not found: ' + name);
    }
    if (!db.url) {
      throw new Error('no db url, set env var DF_DB_URL');
    }
    console.log('syncing:', name, 'to db:', db.url);

    return res.cores.resources[name].sync();

  }).then(function(res) {
    console.log('sync success');

  }).fail(function(err) {
    console.log(err);
  });
}