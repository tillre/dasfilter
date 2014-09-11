var _ = require('lodash');
var Layout = require('../layout.js');


module.exports = function startHandler(app) {

  return function(request, reply) {
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;
      return app.models.wireframes.bySlug('start');

    }).then(function(wireframe) {
      return Layout(app, classes, wireframe);

    }).then(function(layout) {

      var nextDate = layout.refs.chrono.nextDate;
      var nextUrl = nextDate ? request.path + '?date=' + nextDate : '';

      app.replyView(request, reply, 'start-page', {
        pageTitle: 'Das Filter - Medium für Gegenwart',
        pageDescription: 'Medien, Kultur, Technik, Diskurse und Stil. Geschichten, die unser Leben schreibt.',
        classifications: classes,
        layout: layout,
        nextUrl: nextUrl
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
