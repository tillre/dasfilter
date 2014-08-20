
module.exports = function(resources) {

  return {

    byNames: function() {
      return resources.Contributor.view(
        'by_name',
        { include_docs: true }

      ).then(function(result) {
        return result.rows.map(function(row) {
          return row.doc;
        });
      });
    },


    bySlug: function(slug) {
      return resources.Contributor.view(
        'by_slug',
        { key: slug, include_docs: true }

      ).then(function(result) {
        if (result.rows.length === 0) {
          var err = new Error('Contributor not found ' + slug);
          err.code = 404;
          throw err;
        }
        return resources.Contributor.cores.fetchRefs([result.rows[0].doc], true);

      }).then(function(docs) {
        return docs[0];
      });
    }

  };
};