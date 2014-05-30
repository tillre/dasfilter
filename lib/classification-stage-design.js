module.exports = {

  views: {

    categories: {
      map: function(doc) {
        if (doc.type_ === 'ClassificationStage' && doc.classification.type === 'Category') {
          emit(doc._id);
        }
      }
    },

    collections: {
      map: function(doc) {
        if (doc.type_ === 'ClassificationStage' && doc.classification.type === 'Collection') {
          emit(doc._id);
        }
      }
    },

    by_classification: {
      map: function(doc) {
        if (doc.type_ === 'ClassificationStage') {
          emit(doc.classification.id);
        }
      }
    }
  }
};
