var Q = require('kew');
var J = require('jski')();


module.exports = function(plugin, cores, definitions) {

  return function() {

    return cores.resources.Wireframe.view('by_slug', { key: 'start' }).then(function(result) {
      if (result.rows.length > 0) {
        return null;
      }
      var l = J.createValue(definitions.Wireframe.schema);
      l.slug = 'start';
      return cores.resources.Wireframe.save(l).then(function(doc) {
        plugin.log(['api'], 'wireframe for start page created');
      });
    });
  };
};
