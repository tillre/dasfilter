/*
 * Classification denotes the union of Category and Collection resources,
 * defining views that encompass both resource types.
 */
module.exports = {

  views: {

    all: {
      map: function(doc) {
        if (doc.type_ === 'Category' ||
            doc.type_ === 'Collection') {
          emit(doc._id);
        }
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Category' ||
            doc.type_ === 'Collection') {
          emit(doc.slug, doc.type_);
        }
      }
    }
  }
};
