
module.exports = function(app) {

  return function contributorsPageHandler(request, reply) {
    var cls;

    return app.models.classifications.getAll().then(function(cs) {
      cls = cs;
      return app.models.contributors.byNames();

    }).then(function(contributors) {

      app.replyView(request, reply, 'contributors-page', {
        pageTitle: 'Autoren & Mitwirkende',
        pageDescription: 'Das Filter Autoren und Mitwirkende',
        contributors: contributors,
        classifications: cls
      });

    }, function(err) {
      reply(err);
    });
  };
};
