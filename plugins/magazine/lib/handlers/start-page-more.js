var _ = require('lodash');
var Layout = require('../layout.js');

function oneway() {
  return {
    type_: 'chrono-oneway',
    numArticles: 1
  };
}

function twoway(uneven) {
  return {
    type_: 'chrono-twoway',
    display: uneven ? 'uneven' : 'default',
    numArticles: 2
  };
}

function threeway() {
  return {
    type_: 'chrono-threeway',
    display: 'default',
    numArticles: 3
  };
}

var stageDraft = {
  layout: [
    twoway(),
    threeway(),
    threeway(),
    threeway(),
    threeway(),
    threeway(),
    threeway()
  ]
};

stageDraft.numArticles = _.reduce(stageDraft.layout, function(n, group) {
  return n + group.numArticles;
}, 0);



module.exports = function startMoreHandler(app) {

  return function(request, reply) {
    var cls;
    var startDate = request.query.date;

    app.models.classifications.getAll().then(function(cs) {
      cls = cs;
      return Layout(app, _.cloneDeep(stageDraft), startDate);

    }).then(function(stage) {
      app.replyView(request, reply, 'start-page', {
        classifications: cls,
        stage: stage
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
