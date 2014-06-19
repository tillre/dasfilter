
module.exports = function(resources) {

  return {

    bySlug: function(slug) {

      return resources.Page.view(
        'by_slug',
        { key: slug, include_docs: true }

      ).then(function(result) {
        if (result.rows.length === 0) {
          var err = new Error('Page not found');
          err.code = 404;
          throw err;
        }
        return resources.Article.cores.fetchRefs([result.rows[0].doc], true);

      }).then(function(docs) {
        return docs[0];
      });
    }
  };
};