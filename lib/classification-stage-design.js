module.exports = {

  views: {

    by_classification: {
      map: function(doc) {
        if (doc.type_ === 'ClassificationStage') {
          emit(doc.classification);
        }
      }
    }
  }
};
