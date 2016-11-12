var Helpers = require('./helpers.js');


module.exports = function(api) {

  var resource = api.cores.resources.Contributor;

  api.pre.create('Contributor', function(doc) {
    return Helpers.checkCreateSlug(resource, doc);
  });

  api.pre.update('Contributor', function(doc) {
    return Helpers.checkUpdateSlug(resource, doc);
  });
};
