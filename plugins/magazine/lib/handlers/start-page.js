var _ = require('lodash');
var Layout = require('../layout.js');


module.exports = function startHandler(app) {

  return function(request, reply) {
    var cls;

    app.models.classifications.getAll().then(function(cs) {
      cls = cs;
      return app.models.stages.getStartStage();

    }).then(function(stage) {
      return Layout.setupStage(app, stage);

    }).then(function(stage) {
      app.replyView(request, reply, 'start-page', {
        classifications: cls,
        stage: stage
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
