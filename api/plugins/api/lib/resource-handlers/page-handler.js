var Helpers = require('./helpers.js');


module.exports = function(api) {

  var resource = api.cores.resources.Page;

  api.pre.create('Page', function(doc) {
    return Helpers.checkCreateSlug(resource, doc);
  });

  api.pre.update('Page', function(doc) {
    return Helpers.checkUpdateSlug(resource, doc);
  });
};
