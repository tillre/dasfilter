
module.exports = function(resources) {

  return {
    getAll: function() {

      return resources.Classification.view(
        'all',
        { include_docs: true }

      ).then(function(result) {
        var bySlug = {};
        var byId = {};
        var categories = [];
        var collections = [];

        result.rows.forEach(function(row) {
          bySlug[row.doc.slug] = row.doc;
          byId[row.doc._id] = row.doc;
          if (row.doc.type_ === 'Category') {
            categories.push(row.doc);
          }
          else if (row.doc.type_ === 'Collection') {
            collections.push(row.doc);
          }
        });

        return {
          bySlug: bySlug,
          byId: byId,
          categories: categories,
          collections: collections
        };
      });
    }
  };
};