var Util = require('util');
var Hapi = require('hapi');
var Resources = require('df-resources');

var debug = process.env.NODE_ENV !== 'production';

if (debug) {
  console.log('enable longer stack traces');
  require('longjohn');
}


var dbUrl = process.env.DF_DB_URL || 'http://localhost:5984/df';
var staticUrl = process.env.DF_STATIC_URL || 'http://static.dev.dasfilter.com.s3-website-eu-west-1.amazonaws.com';
var context = { imagesUrl: staticUrl + '/images' };
var sync = debug;


Resources(dbUrl, context, sync).then(function(res) {

  var manifest = require('./manifest.js')(res.cores, res.definitions);

  console.log(Util.inspect(manifest, { depth: 5 }));

  Hapi.Pack.compose(manifest, { relativeTo: __dirname }, function(err, pack) {
    if (err) {
      console.log(err);
      console.log(err.stack);
      return;
    }

    pack.start(function() {
      console.log('api server started');
    });
  });

}).fail(function(err) {
  console.log(err);
  console.log(err.stack);
});