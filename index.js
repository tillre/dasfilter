var Util = require('util');
var Hapi = require('hapi');
var manifest = require('./lib/manifest.js');

if (process.env.NODE_ENV !== 'production') {
  console.log('enable longer stack traces');
  require('longjohn');
}


console.log(Util.inspect(manifest));

var composer = new Hapi.Composer(manifest);

composer.compose(function(err) {
  if (err) {
    console.log(err);
    console.log(err.stack);
    return;
  }

  composer.start(function() {
    console.log('admin server started');
  });
});
