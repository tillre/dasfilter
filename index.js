var Path = require('path');
var Walk = require('walk-fs');
var Q = require('kew');
var J = require('jski')();


function camelize(str) {
  return str.replace(/(^\_?\w)|([\_\-]\w)/g, function(m) {
    if (m.charAt(0) === '_') {
      return '_' + m.slice(1).toUpperCase();
    }
    return m.slice(-1).toUpperCase();
  });
};


function extend(a, b) {
  for (var x in b) a[x] = b[x];
  return a;
};


function load(context) {
  context = context || {};

  var defer = Q.defer();
  var dir = Path.join(__dirname, 'lib');
  var resources = {};
  var re = /\/([\w\-]+)-(schema|design)\.js$/i;

  Walk(dir, { recursive: true }, function(path, stats) {
    if (stats.isFile()) {
      var parts = path.match(re);
      if (parts) {
        var name = parts[1].toLowerCase();
        var type = parts[2].toLowerCase();
        var cname = camelize(name);
        var def = require(path);

        // when required module is a function, execute it with context
        if (typeof def === 'function') {
          def = def(context);
        }

        // convert pure json schemas to jski schemas
        if (type === 'schema' && !def.__jski__) {
          console.log('create validator from def', def.__jski__);
          def = J.createValidator(def);
        }
        resources[cname] = resources[cname] || {};
        resources[cname][type] = def;
      }
    }
  }, function(err) {
    if (err) return defer.reject(err);
    defer.resolve(resources);
  });

  return defer.promise;
};

module.exports = load;