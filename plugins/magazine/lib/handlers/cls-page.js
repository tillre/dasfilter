var _ = require('lodash');
var Q = require('kew');
var Wireframe = require('../wireframe.js');
var Layout = require('../layout.js');


module.exports = function clsHandler(app) {

  return function(request, reply) {

    // optional start date for pagination
    var startDate = request.query.date;
    var slug = request.params.tag;

    app.models.classifications.getAll().then(function(cs) {
      var classes = cs;
      var cls = classes.bySlug[request.params.classification];
      if (!cls) {
        // check if it is an article slug and redirect to article
        return app.models.articles.bySlug(request.params.classification).then(function(doc) {
          var c = classes.byId[doc.classification.category.id_];
          reply('You are being redirect...').redirect('/' + c.slug + '/' + doc.slug);
        });
      }

      var type = cls.type_.toLowerCase();
      var wireframe = Wireframe();
      if (type === 'category') {
        wireframe.addGroup(type, '2', { category: cls });
        wireframe.addGroups(7, type, '3', { category: cls });
      }
      else {
        wireframe.addGroup(type, '2', { collection: cls });
        wireframe.addGroups(7, type, '3', { collection: cls });
      }

      return Layout(app, classes, wireframe, startDate).then(function(layout) {

        var nextDate = layout.refs[type][cls._id].nextDate;
        var nextUrl = nextDate ? request.path + '?date=' + nextDate : '';

        app.replyView(request, reply, 'chrono-page', {
          pageType: 'cls-page',
          pageTitle: cls.title,
          pageDescription: 'Artikel zum Thema ' + cls.title,
          mainTitle: cls.title,
          layout: layout,
          classification: cls,
          classifications: classes,
          nextUrl: nextUrl
        });
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
