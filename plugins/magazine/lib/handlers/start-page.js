var Util = require('util');
var Q = require('kew');
var _ = require('lodash');


//
// collect article references from the layout by type
//
function parseLayout(layout) {
  var r = {
    pinnedRefs: [],
    pinnedIds: [],
    usedIds: {},

    chronoRefs: [],

    tagRefs: []
  };

  function addRef(article) {
    if (article.id_) {
      r.pinnedRefs.push(article);
      r.pinnedIds.push(article.id_);
      r.usedIds[article.id_] = true;
    }
    else {
      r.chronoRefs.push(article);
    }
  }

  function addTag(tag, refs) {
    r.tagRefs.push({
      tag: tag,
      refs: refs
    });
  }

  layout.forEach(function(row) {
    switch(row.type_) {

    case 'chrono-oneway':
      row.article = {};
    case 'pinned-oneway':
      addRef(row.article);
      break;

    case 'chrono-twoway':
      row.articles = { one: {}, two: {} };
    case 'pinned-twoway':
      addRef(row.articles.one);
      addRef(row.articles.two);
      break;

    case 'chrono-threeway':
      row.articles = { one: {}, two: {}, three: {} };
    case 'pinned-threeway':
      addRef(row.articles.one);
      addRef(row.articles.two);
      addRef(row.articles.three);
      break;

    case 'tag-oneway':
      row.article = {};
      addTag(row.tag, [
        row.article
      ]);
      break;

    case 'tag-twoway':
      row.articles = { one: {}, two: {} };
      addTag(row.tag, [
        row.articles.one, row.articles.two
      ]);
      break;

    case 'tag-threeway':
      row.articles = { one: {}, two: {}, three: {} };
      addTag(row.tag, [
        row.articles.one, row.articles.two, row.articles.three
      ]);
      break;
    }
  });

  return r;
}

// count occurence of tags
function countTags(articles, counts) {
  counts = counts || {};
  articles.forEach(function(a) {
    if (!a.classification.tags) {
      return;
    }
    a.classification.tags.forEach(function(t) {
      if (counts[t.slug]) counts[t.slug]++;
      else counts[t.slug] = 1;
    });
  });
  return counts;
}

// merge docs into refs
function mergeDocs(used, docs, refs) {
  var ri = 0;
  var di = 0;
  var uniqueDocs = [];
  var duplicates = [];
  // merge non duplicates
  while (true) {
    if (di === docs.length) break;
    if (ri === refs.length) break;
    if (used[docs[di]._id]) {
      duplicates.push(docs[di]);
      ++di;
      continue;
    }
    _.merge(refs[ri], docs[di]);
    used[docs[di]._id] = true;
    uniqueDocs.push(docs[di]);
    ++ri;
    ++di;
  }
  // merge duplicates in case we have run out of uniques
  if (ri < refs.length) {
    for (var i = ri; i < refs.length && duplicates.length > 0; ++i) {
      _.merge(refs[i], duplicates.pop());
    }
  }
  // return only the uniquely merged docs
  return uniqueDocs;
}


//
// get chronological and pinned teasers from the db and put them into the layout
//
function prepareStage(app) {

  return app.models.stages.getStartStage().then(function(stage) {

    var layout = parseLayout(stage.layout);
    var tagCounts = {};

    // get docs for the chronological teasers set
    return app.models.teasers.byClsDate(
      '*',
      new Date().toISOString(),
      layout.chronoRefs.length + layout.pinnedRefs.length

    ).then(function(docs) {
      // merge chrono docs
      var chronoDocs = mergeDocs(layout.usedIds, docs, layout.chronoRefs);

      if (layout.chronoRefs.length > 0) {
        stage.nextDate = layout.chronoRefs[layout.chronoRefs.length - 1].date;
      }

      // count tags in chrono docs
      tagCounts = countTags(chronoDocs, tagCounts);

      // get docs for pinned teasers
      return app.models.teasers.byIds(layout.pinnedIds);

    }).then(function(docs) {
      // merge docs into pinned stage refs
      for (var i = 0; i < layout.pinnedRefs.length && i < docs.length; ++i) {
        _.merge(layout.pinnedRefs[i], docs[i]);
      }
      // count tags in pinned docs
      tagCounts = countTags(docs, tagCounts);

      // get and merge tag docs
      var date = new Date().toISOString();
      var promises = layout.tagRefs.map(function(tr) {
        var slug = tr.tag.slug;
        var limit = tr.refs.length + (tagCounts[slug] ? tagCounts[slug] : 0);

        return app.models.teasers.byTag(slug, date, limit).then(function(docs) {
          mergeDocs(layout.usedIds, docs, tr.refs);
        });
      });
      return Q.all(promises);

    }).then(function() {
      return stage;
    });
  });
}


module.exports = function startHandler(app) {

  return function(request, reply) {
    // optional start date for pagination
    var startDate = request.query.date;
    var continued = !!startDate;

    app.models.classifications.getAll().then(function(cls) {
      return prepareStage(app).then(function(stage) {

        app.replyView(request, reply, 'start-page', {
          classifications: cls,
          stage: stage
        });
      });
    }).fail(function(err) {
      reply(err);
    });
  };
};
