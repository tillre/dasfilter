
module.exports = function(resources) {

  return {

    bySlug: function(slug) {

      return resources.Article.view(
        'by_slug',
        { key: slug, include_docs: true }

      ).then(function(result) {
        if (result.rows.length === 0) {
          var err = new Error('Article not found ' + slug);
          err.code = 404;
          throw err;
        }
        return resources.Article.cores.fetchRefs([result.rows[0].doc], true);

      }).then(function(docs) {
        return docs[0];
      });
    },

    search: function(term, limit, offset) {
      var params = {
        limit: limit || 10,
        offset: offset || 0,
        q: term
      }
      return resources.Article.search('list', params)
    }
  };
};
