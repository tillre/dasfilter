var Util = require('util');
var Layout = require('../layout.js');


module.exports = function contributorHandler(app) {

  return function(request, reply) {

    // optional start date for pagination
    var startDate = request.query.date;
    var slug = request.params.contributor;
    var contributor;
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;
      return app.models.contributors.bySlug(slug);

    }).then(function(c) {
      contributor = c;

      var stage = { groups: [
        Layout.createGroup('contributor', 'spaced', { numTeasers: 2, contributor: contributor }),
        Layout.createGroup('contributor', 'spaced', { numTeasers: 15, contributor: contributor })
      ] };

      return Layout.build(app, classes, stage, startDate);

    }).then(function(layout) {

      var nextDate = layout.refs.contributor[contributor._id].nextDate;
      var name = contributor.firstname + ' ' + contributor.lastname;

      app.replyView(request, reply, 'chrono-page', {
        pageTitle: name,
        mainTitle: 'Artikel von ' + name,
        headerTitleUrl: app.urls.contributor(contributor),
        pageDescription: 'Artikel von ' + name,
        layout: layout,
        classifications: classes,
        nextDate: nextDate
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
