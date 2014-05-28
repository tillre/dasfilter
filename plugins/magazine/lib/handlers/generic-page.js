
module.exports = function(app) {

  return function pageHandler(request, reply) {
    var cls;

    return app.api.getClassifications().then(function(c) {
      cls = c;
      return app.api.getPageBySlug(request.params.page);

    }).then(function(page) {
      app.replyView(request, reply, 'generic-page', {
        page: page,
        classifications: cls
      });

    }, function(err) {
      reply(err);
    });
  };
};
