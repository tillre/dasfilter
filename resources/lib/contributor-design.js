module.exports = {

  views: {

    by_name: {
      map: function(doc) {
        if (doc.type_ === 'Contributor') {
          emit(doc.lastname ? doc.lastname : doc.firstname);
        }
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Contributor' && doc.slug) {
          emit(doc.slug);
        }
      }
    }
  }
};
