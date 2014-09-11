var Util = require('util');
var Wireframe = require('../wireframe.js');
var Layout = require('../layout.js');


module.exports = function tagHandler(app) {

  return function(request, reply) {

    // optional start date for pagination
    var startDate = request.query.date;
    var slug = request.params.tag;
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;

      var wireframe = Wireframe();
      wireframe.addGroup('tag', '2', {tag: { slug: slug }});
      wireframe.addGroups(7, 'tag', '3', {tag: { slug: slug }});

      return Layout(app, classes, wireframe, startDate);

    }).then(function(layout) {

      // get name of tag from first teasers
      var tag = { slug: slug, name: slug };
      if (layout.rows.length && layout.rows[0].teasers.length) {
        layout.rows[0].teasers[0].doc.classification.tags.forEach(function(t) {
          if (t.slug === slug) {
            tag.name = t.name;
          }
        });
      }

      var nextDate = layout.refs.tag[slug].nextDate;
      var nextUrl = nextDate ? request.path + '?date=' + nextDate : '';

      app.replyView(request, reply, 'chrono-page', {
        pageType: 'cls-page',
        pageTitle: tag.name,
        pageDescription: 'Artikel zum Thema ' + tag.name,
        headerTitle: tag.name,
        headerTitleUrl: app.urls.tag(tag),
        layout: layout,
        tag: tag,
        classifications: classes,
        nextUrl: nextUrl
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
