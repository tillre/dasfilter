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

      return Layout.setupStage(app, stage);

    }).then(function(stage) {

      // get complete tag from first teasers doc
      var tag;
      stage.groups[0].teasers[0].doc.classification.tags.forEach(function(t) {
        if (t.slug === slug) {
          tag = t;
        }
      });

      app.replyView(request, reply, 'chrono-page', {
        title: tag.name,
        stage: stage,
        tag: tag,
        classifications: classes,
        isFirstPage: !startDate
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
