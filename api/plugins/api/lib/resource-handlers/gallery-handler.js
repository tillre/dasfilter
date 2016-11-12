var Helpers = require('./helpers.js');

module.exports = function(api) {

  var cls = api.cores.resources.Gallery;

  api.pre.create('Gallery', function(doc) {
    return Helpers.checkCreateSlug(cls, doc);
  });

  api.pre.update('Gallery', function(doc) {
    return Helpers.checkUpdateSlug(cls, doc);
  });
};
