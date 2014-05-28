var Helpers = require('./helpers.js');


module.exports = function(api) {

  var resource = api.cores.resources.Article;

  api.pre.create('Article', function(doc) {
    return Helpers.checkCreateSlug(resource, doc);
  });

  api.pre.update('Article', function(doc) {
    return Helpers.checkUpdateSlug(resource, doc);
  });
};
