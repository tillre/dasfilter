var Util = require('util');
var Q = require('kew');
var _ = require('lodash');


// get the span size of a teaser according to group size and index of teaser
function getSpanSize(groupSize, i) {
  switch(groupSize) {
  case 1: return [6][i];
  case 2: return [3, 3][i];
  case 3: return [2, 2, 2][i];
  case 4: return [3, 3, 3, 3][i];
  case 5: return [3, 3, 2, 2, 2][i];
  case 6: return [2, 2, 2, 2, 2, 2][i];
  default: return 2;
  }
}


// precendence: pinned ; tag, collection, category, chrono
// teaser format: { span, [id], [display], doc }

function collectRefs(stage) {
  return stage.groups.reduce(function(refs, group) {
    var i, t;

    switch(group.type_) {
    case 'chrono':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          display: 'light',
          span: getSpanSize(group.numTeasers, i),
          doc: {}
        };
        group.teasers.push(t);
        refs.chrono.push(t);
      }
      break;

    case 'pinned':
      group.teasers.forEach(function(t, i) {
        // add to chronos when id not set
        t.span = getSpanSize(group.teasers.length, i);
        t.display = 'dark';
        t.doc = {};
        if (t.article.id_) {
          t.id = t.article.id_;
          refs.pinned.push(t);
        } else {
          refs.chrono.push(t);
        }
      });
      break;

    case 'tag':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          id: group.tag.slug,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark',
          doc: {}
        };
        group.teasers.push(t);
        refs.tag.push(t);
      }
      break;

    case 'category':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          id: group.category.id_,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark',
          doc: {}
        };
        group.teasers.push(t);
        refs.category.push(t);
      }
      break;

    case 'collection':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          id: group.collection.id_,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark',
          doc: {}
        };
        group.teasers.push(t);
        refs.collection.push(t);
      }
      break;

    case 'mixed':
      group.teasers.forEach(function(t, i) {
        t.span = getSpanSize(group.teasers.length, i);
        t.display = 'light mixed';
        t.headlineFirst = true;
        t.doc = {};

        switch(t.type_) {
        case 'chronoTeaser':
          t.display = 'light';
          t.headlineFirst = false;
          refs.chrono.push(t);
          break;

        case 'pinnedTeaser':
          if (t.article.id_) {
            t.id = t.article.id_;
            refs.pinned.push(t);
          } else {
            refs.chrono.push(t);
          }
          break;

        case 'tagTeaser':
          t.id = t.tag.slug;
          refs.tag.push(t);
          break;

        case 'categoryTeaser':
          t.id = t.category.id_;
          refs.category.push(t);
          break;

        case 'collectionTeaser':
          t.id = t.collection.id_;
          refs.collection.push(t);
          break;
        }
      });
      break;
    }
    return refs;
  }, {
    chrono: [],
    pinned: [],
    tag: [],
    category: [],
    collection: []
  });
}


function mergePinned(load, refs) {
  if (refs.length === 0) {
    Q.resolve([]);
  }
  var ids = refs.map(function(r) {
    return r.id_;
  });
  return load(ids).then(function(docs) {
    for (var i = 0; i < refs.length && i < docs.length; ++i) {
      _.merge(refs[i].doc, docs[i]);
    }
    return docs;
  });
}


function mergeCls(load, refs, allDocs) {
  if (refs.length === 0) {
    Q.resolve([]);
  }
  var date = new Date().toISOString();
  var newDocs = [];
  var refsByCls = refs.reduce(function(acc, r) {
    if (!acc[r.id]) {
      acc[r.id] = [r];
    } else {
      acc[r.id].push(r);
    }
    return acc;
  }, {});

  return Q.all(_.map(refsByCls, function(refs, id) {
    return load(id, date, refs.length).then(function(docs) {
      newDocs = newDocs.concat(docs);
      for (var i = 0; i < refs.length && i < docs.length; ++i) {
        _.merge(refs[i].doc, docs[i]);
      }
    });
  })).then(function() {
    return newDocs;
  });
}


function mergeChrono(load, refs, allDocs) {
  if (refs.length === 0) {
    Q.resolve([]);
  }
  var date = new Date().toISOString();
  return load('*', date, refs.length).then(function(docs) {
    for (var i = 0; i < refs.length && i < docs.length; ++i) {
      _.merge(refs[i].doc, docs[i]);
    }
  });
}


module.exports = function(app, stage) {
  var allDocs = [];
  var refs = collectRefs(stage);

  return mergePinned(app.models.teasers.byIds, refs.pinned).then(function(docs) {
    allDocs = allDocs.concat(docs);
    return mergeCls(app.models.teasers.byTag, refs.tag, allDocs);
  }).then(function(docs) {
    allDocs = allDocs.concat(docs);
    return mergeCls(app.models.teasers.byClsDate, refs.collection, allDocs);
  }).then(function(docs) {
    allDocs = allDocs.concat(docs);
    return mergeCls(app.models.teasers.byClsDate, refs.category, allDocs);
  }).then(function(docs) {
    allDocs = allDocs.concat(docs);
    return mergeChrono(app.models.teasers.byClsDate, refs.chrono, allDocs);
  }).then(function() {
    console.log('--------- stage at end', Util.inspect(stage, { depth: 100 }));
    return stage;
  });
};
