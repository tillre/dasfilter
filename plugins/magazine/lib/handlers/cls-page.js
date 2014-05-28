var Q = require('kew');

var NUM_ARTICLES = 12;


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

      return app.api.getStage(cls._id).then(function(s) {
        stage = s;

        return app.api.getTeasers(
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
