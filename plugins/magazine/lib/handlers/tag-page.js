
var NUM_ARTICLES = 12;

module.exports = function tagHandler(app) {

  return function(request, reply) {
    var classes;

    // optional start date for pagination
    var startDate = request.query.date;

    app.api.getClassifications().then(function(cs) {
      classes = cs;

      return app.api.getTeasersByTag(
        request.params.tag,
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
        classifications: classes,
        nextDate: nextDate,
        isFirstPage: !startDate
      });

    }).fail(function(err) {
      reply(err);
    });

  };
};
