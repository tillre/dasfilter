var _ = require('lodash');
var Layout = require('../layout.js');


module.exports = function startHandler(app) {

  return function(request, reply) {
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;
      return app.models.stages.getStartStage();

    }).then(function(stage) {
      return Layout.build(app, classes, stage);

    }).then(function(layout) {

      var nextDate = layout.refs.chrono.nextDate;
      console.log('nextDate', nextDate);

      app.replyView(request, reply, 'start-page', {
        classifications: classes,
        layout: layout,
        nextDate: nextDate
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
