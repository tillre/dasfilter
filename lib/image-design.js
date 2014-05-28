module.exports = {

  views: {

    all: {
      map: function(doc) {
        if (doc.type_ === 'Image') {
          emit(doc.stamp_.created.date || doc.stamp_.modified.date);
        }
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Image') {
          emit(doc.slug);
        }
      }
    },

    by_url: {
      map: function(doc) {
        if (doc.type_ === 'Image') {
          emit(doc.file.url);
        }
      }
    },

    by_family_date: {
      map: function(doc) {
        if (doc.type_ === 'Image') {
          emit([doc.family, doc.stamp_.modified.date]);
        }
      }
    }
  }
};
