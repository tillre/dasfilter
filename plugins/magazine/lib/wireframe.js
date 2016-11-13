var _ = require('lodash');


module.exports = function createWireframe() {
  var w = {
    groups: []
  };

  w.addGroup = function(type, layout, options) {
    w.groups.push(_.merge({
      type_: type,
      layout: layout || ''
    }, options));
  };

  w.addGroups = function(num, type, layout, options) {
    for (var i = 0; i < num; ++i) {
      w.groups.push(_.merge({
        type_: type,
        layout: layout || ''
      }, options));
    }
  };

  return w;
};