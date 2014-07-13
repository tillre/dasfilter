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
function countTags(articles) {
  return _.reduce(articles, function(counts, a) {
    if (!a.classification.tags) {
      return counts;
    }
    a.classification.tags.forEach(function(t) {
      if (counts[t.slug]) counts[t.slug]++;
      else counts[t.slug] = 1;
    });
    return counts;
  }, {});
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


// merge docs for the chronological teasers set
function mergeChronos(app, stage, config, startDate) {

  // get docs for the chronological teasers set
  return app.models.teasers.byClsDate(
    '*',
    startDate || new Date().toISOString(),
    config.chronoRefs.length + config.pinnedRefs.length

  ).then(function(docs) {
    // merge chrono docs
    var chronoDocs = mergeDocs(config.usedIds, docs, config.chronoRefs);

    if (config.chronoRefs.length > 0) {
      stage.nextDate = config.chronoRefs[config.chronoRefs.length - 1].date;
    }
    return chronoDocs;
  });
}


// merge docs for the pinned teasers set
function mergePinned(app, stage, config) {
  if (config.pinnedIds.length === 0) {
    return Q.resolve([]);
  }
  return app.models.teasers.byIds(config.pinnedIds).then(function(docs) {

    // merge docs into pinned stage refs
    for (var i = 0; i < config.pinnedRefs.length && i < docs.length; ++i) {
      _.merge(config.pinnedRefs[i], docs[i]);
    }
    return docs;
  });
}


// merge docs for the tags teasers sets
function mergeTags(app, stage, config, allDocs) {
  if (config.tagRefs.length === 0) {
    return Q.resolve();
  }
  var date = new Date().toISOString();
  var tagCounts = countTags(allDocs);

  return Q.all(config.tagRefs.map(function(tr) {
    var slug = tr.tag.slug;
    var limit = tr.refs.length + (tagCounts[slug] ? tagCounts[slug] : 0);

    return app.models.teasers.byTag(slug, date, limit).then(function(docs) {
      mergeDocs(config.usedIds, docs, tr.refs);
    });
  }));
}


//
// get chronological and pinned teasers from the db and merge them into the layout
//
module.exports = function prepareStage(app, stage, startDate) {

  var config = parseLayout(stage.layout);
  var allDocs = [];

  return mergeChronos(app, stage, config, startDate).then(function(docs) {

    allDocs = allDocs.concat(docs);

    return mergePinned(app, stage, config);

  }).then(function(docs) {

    allDocs = allDocs.concat(docs);

    return mergeTags(app, stage, config, allDocs).then(function() {
      return stage;
    });
  });
};