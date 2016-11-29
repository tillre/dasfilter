var Util = require('util');
var Hapi = require('hapi');
var compose = require('glue').compose
var Resources = require('./resources');

var debug = process.env.NODE_ENV !== 'production';

var dbUrl = process.env.DF_DB_URL;
var staticUrl = process.env.DF_STATIC_URL;
var context = { imagesUrl: staticUrl + '/images' };
var syncDB = true;

Resources(dbUrl, context, syncDB).then(function(res) {

  var manifest = require('./manifest.js')(res.cores, res.definitions);

  compose(manifest, { relativeTo: __dirname }, function(err, pack) {
    if (err) {
      console.log(err);
      console.log(err.stack);
      return;
    }

    pack.start(function() {
      console.log('server started');
    });
  });

}).fail(function(err) {
  console.log(err);
  console.log(err.stack);
});
