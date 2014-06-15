var _ = require('lodash');
var Q = require('kew');

var NUM_ARTICLES = 12;


function prepareStage(app, id) {

  return app.api.getClsStage(id).then(function(stage) {

    // load auto and manual articles
    var promises = [];
    var refs = {};

    // load auto articles and collect manual article refs
    stage.aside.forEach(function(item) {
      if (item.type_ === 'newest-of-category' || item.type_ === 'newest-of-collection') {
        promises.push(app.api.getTeasersByClsDate(
          item.classification.id_,
          new Date().toISOString(),
          item.numArticles

        ).then(function(docs) {
          item.articles = docs;
        }));
      }
      else if (item.type_ === 'articles') {
        item.articles.forEach(function(a) {
          refs[a.id_] = a;
        });
      }
    });

    // load manual articles and merge them into the stage refs
    var ids = Object.keys(refs);
    promises.push(
      app.api.getTeasersByIds(ids).then(function(docs) {
        docs.forEach(function(doc) {
          _.merge(refs[doc._id], doc);
        });
      })
    );

    // handle all created promises
    return Q.all(promises).then(function() {
      return stage;
    });
  });
}


module.exports = function clsHandler(app) {

  return function(request, reply) {
    // optional start date for pagination
    var startDate = request.query.date;

    app.api.getClassifications().then(function(classes) {

      var cls = classes.bySlug(request.params.classification);
      if (!cls) {
        var err = new Error('Category or Collection not found: ' + request.params.classification);
        err.code = 404;
        throw err;
      }

      var stage = null;

      return prepareStage(app, cls._id).then(function(s) {
        stage = s;

        return app.api.getTeasersByClsDate(
          cls._id,
          startDate || new Date().toISOString(),
          NUM_ARTICLES + 1
        );

      }).then(function(docs) {

        var nextDate = '';
        if (docs.length > NUM_ARTICLES) {
          nextDate = docs[docs.length - 2].date;
          docs.pop();
        }

        app.replyView(request, reply, 'cls-page', {
          articles: docs,
          classification: cls,
          classifications: classes,
          stage: stage,
          nextDate: nextDate,
          isFirstPage: !startDate
        });
      });
    }).fail(function(err) {
      reply(err);
    });
  };
};
