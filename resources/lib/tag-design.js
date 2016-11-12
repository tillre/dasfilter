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
  },

  indexes: {
    list: {
      analyzer: "german",
      index: function(doc) {
        if (doc.type_ === 'Tag') {
          index('default', doc.name);
        }
      }
    }
  }
};
