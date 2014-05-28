var Util = require('util');
var Hapi = require('hapi');
var manifest = require('./lib/manifest.js');

console.log(Util.inspect(manifest));

var composer = new Hapi.Composer(manifest);

composer.compose(function(err) {
  if (err) {
    console.log(err);
    console.log(err.stack);
    return;
  }

  composer.start(function() {
    console.log('web server started');
  });
});
