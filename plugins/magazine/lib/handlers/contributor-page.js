var Util = require('util');
var Wireframe = require('../wireframe.js');
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

      var wireframe = Wireframe();
      wireframe.addGroup('contributor', '2', { contributor: contributor });
      wireframe.addGroups(7, 'contributor', '3', { contributor: contributor });

      return Layout(app, classes, wireframe, startDate);

    }).then(function(layout) {

      var nextDate = layout.refs.contributor[contributor._id].nextDate;
      var nextUrl = nextDate ? request.path + '?date=' + nextDate : '';
      var name = contributor.firstname + ' ' + contributor.lastname;

      app.replyView(request, reply, 'chrono-page', {
        pageType: 'contributor-page',
        pageTitle: name,
        mainTitle: 'Beiträge von ' + name,
        pageDescription: 'Beiträge von ' + name,
        layout: layout,
        classifications: classes,
        nextUrl: nextUrl
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
