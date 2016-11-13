var Helpers = require('./helpers.js');

module.exports = function(api, syncWireframes) {

  var cls = api.cores.resources.Classification;

  api.pre.create('Category', function(doc) {
    return Helpers.checkCreateSlug(cls, doc);
  });

  api.post.create('Category', function(doc) {
    return syncWireframes().then(function() {
      return doc;
    });
  });

  api.pre.update('Category', function(doc) {
    return Helpers.checkUpdateSlug(cls, doc);
  });
};
