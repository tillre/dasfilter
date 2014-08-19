var Util = require('util');
var Layout = require('../layout.js');


module.exports = function tagHandler(app) {

  return function(request, reply) {

    // optional start date for pagination
    var startDate = request.query.date;
    var slug = request.params.tag;
    var classes;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;

      var stage = { groups: [
        Layout.createGroup('tag', 'spaced', { numTeasers: 2, tag: { slug: slug }, seperate: false }),
        Layout.createGroup('tag', 'spaced', { numTeasers: 15, tag: { slug: slug } })
      ] };

      return Layout.build(app, classes, stage, startDate);

    }).then(function(layout) {

      // get name of tag from first teasers
      var tag = { slug: slug, name: slug };
      if (layout.groups.length && layout.groups[0].teasers.length) {
        layout.groups[0].teasers[0].doc.classification.tags.forEach(function(t) {
          if (t.slug === slug) {
            tag.name = t.name;
          }
        });
      }

      var nextDate = layout.refs.tag[slug].nextDate;

      app.replyView(request, reply, 'chrono-page', {
        pageType: 'cls-page',
        pageTitle: tag.name,
        pageDescription: 'Artikel zum Thema ' + tag.name,
        layout: layout,
        tag: tag,
        classifications: classes,
        nextDate: nextDate
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
