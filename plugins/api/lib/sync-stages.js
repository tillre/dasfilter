var Q = require('kew');
var J = require('jski')();


module.exports = function(plugin, cores, resDefs) {

  // create stages which dont yet exist

  return function() {
    var classes = [];

    // create start page stage when missing
    cores.resources.StartStage.view('all').then(function(result) {
      if (result.rows.length > 0) {
        return null;
      }
      var stage = J.createValue(resDefs.StartStage.schema);
      return cores.resources.StartStage.save(stage).then(function(doc) {
        plugin.log(['api'], 'stage for start page created');
      });

    }).then(function() {
      // create missing classification stage pages
      return cores.resources.Classification.view('all', { include_docs: true });

    }).then(function(result) {
      classes = result.rows.map(function(row) { return row.doc; });
      return cores.resources.ClassificationStage.view('all', { include_docs: true });

    }).then(function(result) {
      var stages = {};
      result.rows.forEach(function(row) {
        stages[row.doc.classification.id] = row.doc;
      });

      var missingStages = classes.filter(function(cls) {
        return !stages[cls._id];
      });

      if (!missingStages.length) return;

      var promises = missingStages.map(function(cls) {
        var stage = J.createValue(resDefs.ClassificationStage.schema);
        stage.title = cls.title;
        stage.classification.id = cls._id;
        stage.classification.type = cls.type_;

        return cores.resources.ClassificationStage.save(stage).then(function(doc) {
          plugin.log(['api'], 'stage for classification created: ' + cls.title);
        });
      });
      return Q.all(promises);
    });
  };
};
