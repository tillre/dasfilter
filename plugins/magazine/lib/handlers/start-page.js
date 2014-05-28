// Layout

var groups = {
  oneway: { type: 'oneway', numArticles: 1 },
  onewayFull: { type: 'oneway-full', numArticles: 1},
  twoway: { type: 'twoway', numArticles: 2 },
  twowayFull: { type: 'twoway-full', numArticles: 2 },
  threeway: { type: 'threeway', numArticles: 3 }
};

var startLayout = [
  groups.twowayFull,
  groups.threeway,
  groups.twoway,
  groups.onewayFull,
  groups.threeway,
  groups.threeway,
  groups.twowayFull,
  groups.oneway,
  groups.threeway
];

var moreLayout = [
  groups.twowayFull,
  groups.threeway,
  groups.threeway,
  groups.twoway,
  groups.threeway,
  groups.threeway,
  groups.twoway,
  groups.threeway,
  groups.threeway
];


var START_NUM_ARTICLES = startLayout.reduce(function(a, b) {
  return a + b.numArticles;
}, 0);

var MORE_NUM_ARTICLES = moreLayout.reduce(function(a, b) {
  return a + b.numArticles;
}, 0);


function layoutGroups(layout, articles) {
  var remaining = articles.slice();
  var groups = [];

  layout.some(function(sl) {
    groups.push({
      type_: sl.type,
      articles: remaining.splice(0, sl.numArticles)
    });
    return remaining.length === 0;
  });
  return groups;
}


module.exports = function startHandler(app) {

  return function(request, reply) {
    // optional start date for pagination
    var startDate = request.query.date;
    var continued = !!startDate;

    app.api.getClassifications().then(function(cls) {

      app.api.getTeasers(
        '*',
        startDate || new Date().toISOString(),
        START_NUM_ARTICLES + 1

      ).then(function(docs) {
        var nextDate = '';
        if (docs.length > START_NUM_ARTICLES) {
          nextDate = docs[docs.length - 2].date;
          docs.pop();
        }

			  app.replyView(request, reply, 'start-page', {
				  classifications: cls,
				  groups: layoutGroups(continued ? moreLayout : startLayout, docs),
          nextDate: nextDate,
          continued: continued
			  });
      });
    }).fail(function(err) {
      reply(err);
    });
  };
};
