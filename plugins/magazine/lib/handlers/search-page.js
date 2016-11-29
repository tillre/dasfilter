var Request = require('request');
var Q = require('kew');
var Wireframe = require('../wireframe.js');
var Layout = require('../layout.js');


module.exports = function(app) {
  var NUM_RESULTS = 21;

  return function pageHandler(request, reply) {
    var classes;
    // remove any non valid chars from query
    var query = (request.query.q || '').replace(/[^\s\wäöüß]+/ig, "");
    var page = request.query.p ? parseInt(request.query.p, 10) : 0;
    var nextUrl = '';
    var hasHits = true;

    return app.models.classifications.getAll().then(function(cs) {
      classes = cs;
      return app.models.articles.search(query, NUM_RESULTS + 1, page * NUM_RESULTS);

    }).then(function(result) {
      var ids = result.rows.map(function(row) {
        return row.id
      })

      if (ids.length === NUM_RESULTS + 1) {
        // remove the one which was added for pagination
        ids.pop();
        nextUrl = request.path + '?q=' + query + '&p=' + (page + 1);
      }
      if (ids.length === 0) {
        hasHits = false;
      }

      // put ids into groups of 3
      var groups = [];
      var teasers = [];
      for (var i = 0; i < ids.length; ++i) {
        teasers.push({ article: { id_: ids[i] }});
        if (teasers.length === 3) {
          groups.push(teasers);
          teasers = [];
        }
      }
      if (teasers.length > 0) {
        groups.push(teasers);
      }

      var wireframe = Wireframe();
      groups.forEach(function(teasers) {
        wireframe.addGroup('pinned', '3', { teasers: teasers, dontSeperate: true });
      });
      return Layout(app, classes, wireframe);

    }).then(function(layout) {
      app.replyView(request, reply, 'chrono-page', {
        pageType: 'search-page',
        pageTitle: 'Suchen',
        mainTitle: hasHits ? 'Suchergebnisse für: ' + query
          : 'Es wurden keine Ergebnisse gefunden',
        pageDescription: 'Durchsuche Das Filter',
        classifications: classes,
        searchValue: query,
        layout: layout,
        nextUrl: nextUrl
      });

    }, function(err) {
      reply(err);
    });
  };
};
