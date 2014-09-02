

module.exports = function(resources) {

  return {

    bySlug: function(slug) {

      return resources.Wireframe.view(
        'by_slug',
        { key: slug, include_docs: true }

      ).then(function(result) {
        if (result.length === 0) {
          throw new Error('No start wireframe found');
        }
        return result.rows[0].doc;
      });
    }
  };
};