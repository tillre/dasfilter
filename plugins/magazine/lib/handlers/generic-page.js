
module.exports = function(app) {

  return function pageHandler(request, reply) {
    var cls;

    return app.models.classifications.getAll().then(function(cs) {
      cls = cs;
      return app.models.pages.bySlug(request.params.page);

    }).then(function(page) {
      app.replyView(request, reply, 'generic-page', {
        pageTitle: page.title + (page.subTitle || ''),
        pageDescription: page.description || '',
        page: page,
        classifications: cls
      });

    }, function(err) {
      reply(err);
    });
  };
};
