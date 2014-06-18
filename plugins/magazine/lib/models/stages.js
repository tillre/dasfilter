

module.exports = function(resources) {

  return {

    getStartStage: function() {

      return resources.StartStage.view(
        'all',
        { include_docs: true }

      ).then(function(result) {
        if (result.length === 0) {
          throw new Error('No start stage found');
        }
        return result.rows[0].doc;
      });
    },


    getClsStage: function(clsId) {

      return resources.ClassificationStage.view(
        'by_classification',
        { key: clsId, include_docs: true }

      ).then(function(result) {
        if (result.length === 0) {
          throw new Error('No cls stage found for id: ' + clsId);
        }
        return result.rows[0].doc;
      });
    }
  };
};