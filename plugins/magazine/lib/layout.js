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


function collectRefs(stage) {
  // ref format: { type, span, [id], [display], doc }
  var refs = {
    chrono: [],
    pinned: [],
    tag: {},
    category: {},
    collection: {}
  };

  function addChrono(r) {
    refs.chrono.push(r);
  }

  function addPinned(r) {
    refs.pinned.push(r);
  }

  function addCls(type, r) {
    if (!refs[type][r.id]) {
      refs[type][r.id] = [r];
    }
    else {
      refs[type][r.id].push(r);
    }
  }


  stage.groups.forEach(function(group) {
    var i, t;

    switch(group.type_) {
    case 'chrono':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          type: 'chrono',
          display: 'light',
          span: getSpanSize(group.numTeasers, i)
        };
        group.teasers.push(t);
        addChrono(t);
      }
      break;

    case 'pinned':
      group.teasers.forEach(function(t, i) {
        // add to chronos when id not set
        t.span = getSpanSize(group.teasers.length, i);
        t.display = 'dark';
        if (t.article.id_) {
          t.type = 'pinned';
          t.id = t.article.id_;
          addPinned(t);
        } else {
          t.type = 'chrono';
          addChrono(t);
        }
      });
      break;

    case 'tag':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          type: 'tag',
          id: group.tag.slug,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark'
        };
        group.teasers.push(t);
        addCls('tag', t);
      }
      break;

    case 'category':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          type: 'category',
          id: group.category.id_,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark'
        };
        group.teasers.push(t);
        addCls('category', t);
      }
      break;

    case 'collection':
      group.teasers = [];
      for (i = 0; i < group.numTeasers; ++i) {
        t = {
          type: 'collection',
          id: group.collection.id_,
          span: getSpanSize(group.numTeasers, i),
          display: 'dark'
        };
        group.teasers.push(t);
        addCls('collection', t);
      }
      break;

    case 'mixed':
      group.teasers.forEach(function(t, i) {
        t.span = getSpanSize(group.teasers.length, i);
        t.display = 'light mixed';
        t.headlineFirst = true;

        switch(t.type_) {
        case 'chronoTeaser':
          t.type = 'chrono';
          t.display = 'light';
          t.headlineFirst = false;
          addChrono(t);
          break;

        case 'pinnedTeaser':
          if (t.article.id_) {
            t.type = 'pinned';
            t.id = t.article.id_;
            addPinned(t);
          } else {
            t.type = 'chrono';
            addChrono(t);
          }
          break;

        case 'tagTeaser':
          t.type = 'tag';
          t.id = t.tag.slug;
          addCls('tag', t);
          break;

        case 'categoryTeaser':
          t.type = 'category';
          t.id = t.category.id_;
          addCls('category', t);
          break;

        case 'collectionTeaser':
          t.type = 'collection';
          t.id = t.collection.id_;
          addCls('collection', t);
          break;
        }
      });
      break;
    }
  });
  return refs;
}


function loadPinned(load, refs) {
  var ids = refs.map(function(r) { return r.id; });
  return load(ids);
}


function loadChrono(load, date, refs, offset) {
  return load('*', date, refs.length + offset);
}


function loadCls(load, date, refsById, offset) {
  var ids = Object.keys(refsById);

  return Q.all(ids.map(function(id) {
    var num = refsById[id].length;
    return load(id, date, num + offset);

  })).then(function(results) {
    var docsById = {};
    ids.forEach(function(id, i) {
      docsById[id] = results[i];
    });
    return docsById;
  });
}

//
// merge
//

function mergeRefs(refs, docs, usedIds) {
  var i, j = 0;
  var id;
  var duplicates = [];
  // merge previously unused docs
  for (i = 0; i < docs.length && j < refs.length; ++i) {
    id = docs[i]._id;
    if (usedIds[id]) {
      duplicates.push(docs[i]);
      continue;
    }
    refs[j].doc = docs[i];
    usedIds[id] = true;
    ++j;
  }
  // fill remaining empty refs with duplicates
  for ( i = 0; i < duplicates.length && j < refs.length; ++i) {
    refs[j].doc = duplicates[i];
    ++j;
  }
}


function mergePinned(refs, docs, usedIds) {
  mergeRefs(refs, docs, usedIds);
}


function mergeChrono(refs, docs, usedIds) {
  mergeRefs(refs, docs, usedIds);
}


function mergeCls(refsById, docsById, usedIds) {
  _.each(refsById, function(ref, id) {
    mergeRefs(ref, docsById[id], usedIds);
  });
}



module.exports = function fillStage(app, stage) {
  var refs = collectRefs(stage);
  var teasers = app.models.teasers;
  var date = new Date().toISOString();

  var offsetChrono = refs.pinned.length +
        _.reduce(refs.tag, function(sum, t) {
          return sum + t.length;
        }, 0);

  var order = [
    { type: 'pinned',
      promise: loadPinned(teasers.byIds, refs.pinned),
      merge: mergePinned },
    { type: 'tag',
      promise: loadCls(teasers.byTag, date, refs.tag, 0),
      merge: mergeCls },
    { type: 'chrono',
      promise: loadChrono(teasers.byClsDate, date, refs.chrono, offsetChrono),
      merge: mergeChrono },
    { type: 'collection',
      promise: loadCls(teasers.byClsDate, date, refs.collection, 5),
      merge: mergeCls },
    { type: 'category',
      promise: loadCls(teasers.byClsDate, date, refs.category, 5),
      merge: mergeCls }
  ];

  return Q.all(order.map(function(o) { return o.promise; })).then(function(results) {

    var usedIds = {};
    order.forEach(function(o, i) {
      o.merge(refs[o.type], results[i], usedIds);
    });

    //console.log('--------- stage', Util.inspect(stage, { depth: 4 }));
    return stage;
  });
};
