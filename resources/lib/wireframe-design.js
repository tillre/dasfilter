module.exports = {

  views: {

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Wireframe') {
          emit(doc.slug);
        }
      }
    }
  }
};