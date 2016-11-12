module.exports = {

  views: {

    all: {
      map: function(doc) {
        if (doc.type_ === 'Category') {
          emit(doc.stamp_.modified.date);
        }
      }
    }
  }
};
