module.exports = {

  views: {

    all: {
      map: function(doc) {
        if (doc.type_ === 'Tag') {
          emit(doc.name);
        }
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Tag') {
          emit(doc.slug);
        }
      }
    }
  }
};
