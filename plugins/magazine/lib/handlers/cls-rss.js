
module.exports = function clsRssHandler(app) {

  return function(request, reply) {

    app.api.getClassifications().then(function(classes) {

      var cls = classes.bySlug(request.params.classification);
      if (!cls) {
        var err = new Error('Category or Collection not found: ' + request.params.classification);
        err.code = 404;
        throw err;
      }

      app.api.getTeasers(
        cls._id,
        new Date().toISOString(),
        20

      ).then(function(docs) {
			  var res = app.replyView(request, reply, 'rss', {
          classification: cls,
				  articles: docs
			  }, { contentType: 'application/xml' });
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
