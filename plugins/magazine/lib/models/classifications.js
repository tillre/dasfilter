
function filterByType(rows, type) {
  return rows.filter(function(row) {
    return row.doc.type_ === type;
  }).map(function(row) {
    return row.doc;
  });
};


module.exports = function(resources) {

  return {
    getAll: function() {

      return resources.Classification.view(
        'all',
        { include_docs: true }

      ).then(function(result) {
        var allBySlug = {};
        var categories = [];
        var collections = [];

        result.rows.forEach(function(row) {
          allBySlug[row.doc.slug] = row.doc;
          if (row.doc.type_ === 'Category') {
            categories.push(row.doc);
          }
          else if (row.doc.type_ === 'Classification') {
            collections.push(row.doc);
          }
        });

        return {
          allBySlug: allBySlug,
          categories: categories,
          collections: collections
        };
      });
    }
  };
};