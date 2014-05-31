var _ = require('lodash');


//
// extract chronogical and preset article references from the layout rows
//
function parseLayout(layout) {
  var r = {
    presetRefs: [],
    presetIds: [],
    presetIdsSet: {},
    chronoRefs: []
  };

  function addRef(article) {
    if (article.id_) {
      r.presetRefs.push(article);
      r.presetIds.push(article.id_);
      r.presetIdsSet[article.id_] = true;
    }
    else {
      r.chronoRefs.push(article);
    }
  }

  layout.forEach(function(row) {
    switch(row.type_) {
    case 'oneway':
      addRef(row.article);
      break;
    case 'twoway':
      addRef(row.articles.one);
      addRef(row.articles.two);
      break;
    case 'threeway':
      addRef(row.articles.one);
      addRef(row.articles.two);
      addRef(row.articles.three);
      break;
    }
  });

  return r;
}


//
// get chronological and preset teasers from the db and put them into the layout
//
function prepareStage(app) {

  return app.api.getStartStage().then(function(stage) {

    var layout = parseLayout(stage.layout);

    // get docs for the chronological teasers set
    return app.api.getTeasersByClsDate(
      '*',
      new Date().toISOString(),
      layout.chronoRefs.length + layout.presetIds.length

    ).then(function(docs) {
      // merge docs into empty stage refs
      var ci = 0;
      var di = 0;
      while (true) {
        if (di === docs.length) break;
        if (ci === layout.chronoRefs.length) break;
        // omit docs which are part of the preset set
        if (layout.presetIdsSet[docs[di]._id]) {
          ++di;
          continue;
        }
        _.merge(layout.chronoRefs[ci], docs[di]);
        ++ci;
        ++di;
      }

      // get docs for preset teasers
      return app.api.getTeasersByIds(layout.presetIds);

    }).then(function(docs) {
      // merge docs into preset stage refs
      for (var i = 0; i < layout.presetRefs.length && i < docs.length; ++i) {
        _.merge(layout.presetRefs[i], docs[i]);
      }
      return stage;
    });
  });
}


module.exports = function startHandler(app) {

  return function(request, reply) {
    // optional start date for pagination
    var startDate = request.query.date;
    var continued = !!startDate;

    app.api.getClassifications().then(function(cls) {
      return prepareStage(app).then(function(stage) {
        app.replyView(request, reply, 'start-page', {
          classifications: cls,
          groups: stage.layout
        });
      });
    }).fail(function(err) {
      reply(err);
    });
  };
};
