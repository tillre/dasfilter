module.exports = {

  views: {

    by_classification: {
      map: function(doc) {
        if (doc.type_ === 'Pick') {

          doc.categories.forEach(function(col) {
            emit(col.id_);
          });

          doc.collections.forEach(function(col) {
            emit(col.id_);
          });
        }
      }
    }

  }
};
