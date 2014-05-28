var Helpers = require('./helpers.js');

module.exports = function(api, syncStages) {

  var cls = api.cores.resources.Classification;

  api.pre.create('Collection', function(doc) {
    return Helpers.checkCreateSlug(cls, doc);
  });

  api.post.create('Collection', function(doc) {
    return syncStages().then(function() {
      return doc;
    });
  });

  api.pre.update('Collection', function(doc) {
    return Helpers.checkUpdateSlug(cls, doc);
  });
};
