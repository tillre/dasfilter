var Util = require('util');
var Hapi = require('hapi');
var manifest = require('./manifest.js');

if (process.env.NODE_ENV !== 'production') {
  console.log('enable longer stack traces');
  require('longjohn');
}

console.log(Util.inspect(manifest));

//var composer = new Hapi.Composer(manifest);

Hapi.Pack.compose(manifest, { relativeTo: __dirname }, function(err, pack) {
  if (err) {
    console.log(err);
    console.log(err.stack);
    return;
  }

  pack.start(function() {
    console.log('web server started');
  });
});
