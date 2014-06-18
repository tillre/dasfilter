var Util = require('util');
var Hapi = require('hapi');
var Resources = require('df-resources');
var Config = require('./lib/config.js');


if (process.env.NODE_ENV !== 'production') {
  console.log('enable longer stack traces');
  require('longjohn');
}


var context = { imagesUrl: Config.urls.static + '/images' };
var sync = Config.debug;

Resources(Config.db, context, sync).then(function(res) {

  var manifest = require('./lib/manifest.js')(Config, res.cores);

  console.log(Util.inspect(manifest, { depth: 5 }));

  var composer = new Hapi.Composer(manifest);

  composer.compose(function(err) {
    if (err) {
      console.log(err);
      console.log(err.stack);
      return;
    }

    composer.start(function() {
      console.log('api server started');
    });
  });

}).fail(function(err) {
  console.log(err);
  console.log(err.stack);
});