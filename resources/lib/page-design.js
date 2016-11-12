module.exports = {

  views: {

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Page') {
          emit(doc.slug, null);
        }
      }
    }

  }
};
