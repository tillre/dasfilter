var Helpers = require('./helpers.js');

module.exports = function(api) {

  var resource = api.cores.resources.Tag;

  api.pre.create('Tag', function(doc) {
    return Helpers.checkCreateSlug(resource, doc);
  });

  api.pre.update('Tag', function(doc) {
    return Helpers.checkUpdateSlug(resource, doc);
  });
};
