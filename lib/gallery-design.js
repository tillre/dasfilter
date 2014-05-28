module.exports = {

  views: {

    all: {
      map: function(doc) {
        if (doc.type_ === 'Gallery') {
          emit(doc.stamp_.modified.date);
        }
      }
    },


    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Gallery') {
          emit(doc.slug);
        }
      }
    }
  }
};
