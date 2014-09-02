var Util = require('util');
var _ = require('lodash');
var Layout = require('../layout.js');

module.exports = function tagHandler(app) {

  return function(request, reply) {

    // start date for pagination
    var startDate = request.query.date;
    var slug = request.params.tag;
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;

      var wireframe = { groups: [
        Layout.createGroup('chrono', 'spaced', { numTeasers: 2 }),
        Layout.createGroup('chrono', 'spaced', { numTeasers: 15 })
      ] };

      return Layout.build(app, classes, wireframe, startDate);

    }).then(function(layout) {

      var nextDate = layout.refs.chrono.nextDate;

      app.replyView(request, reply, 'chrono-page', {
        pageTitle: 'Alle Artikel',
        pageDescription: 'Medien, Kultur, Technik, Diskurse und Stil. Geschichten, die unser Leben schreibt.',
        layout: layout,
        classifications: classes,
        pageType: 'start-page-continued',
        nextDate: nextDate
      });

    }).fail(function(err) {
      reply(err);
    });

  };
};