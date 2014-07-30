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

function getPromotedSize(groupSize, i) {
  switch(groupSize) {
  case 1: return [6][i];
  case 2: return [4, 2][i];
  case 3: return [6, 3, 3][i];
  case 4: return [6, 2, 2, 2][i];
  case 5: return [3, 3, 2, 2, 2][i];
  case 6: return [6, 3, 3, 2, 2, 2][i];
  default: return 2;
  }
}



function createTeaser(type, span, display, options, groupOptions) {
  return _.merge({
    type: type,
    span: span,
    display: display || ''
  }, options, groupOptions);
}


function createGroup(type, display, options) {
  return _.merge({
    type_: type,
    display: display || '',
    teasers: []
  }, options);
}


function createRefs() {
  var refs = {
    chrono: [],
    pinned: [],
    tag: {},
    category: {},
    collection: {}
  };

  return _.merge(refs, {
    addChrono: function(r) {
      refs.chrono.push(r);
    },

    addPinned: function(r) {
      refs.pinned.push(r);
    },

    addCls: function(type, r) {
      if (!refs[type][r.id]) {
        refs[type][r.id] = [r];
      }
      else {
        refs[type][r.id].push(r);
      }
    }
  });
}


function collectGroupRefs(group, refs) {
  var i, t;
  var spans = 0;
  var getSize = getSpanSize;

  switch(group.type_) {
  case 'chrono':
    group.teasers = [];
    for (i = 0; i < group.numTeasers; ++i) {
      spans = getSize(group.numTeasers, i);
      t = createTeaser('chrono',
                       getSize(group.numTeasers, i),
                       '',
                       group.teaserOptions);
      group.teasers.push(t);
      refs.addChrono(t);
    }
    break;

  case 'pinned':
    group.teasers.forEach(function(t, i) {
      // add to chronos when id not set
      t.span = getSize(group.teasers.length, i);
      t.display = '';
      if (t.article.id_) {
        t.type = 'pinned';
        t.id = t.article.id_;
        refs.addPinned(t);
      } else {
        t.type = 'chrono';
        refs.addChrono(t);
      }
    });
    break;

  case 'tag':
    group.teasers = [];
    for (i = 0; i < group.numTeasers; ++i) {
      t = createTeaser('tag',
                       getSize(group.numTeasers, i),
                       '',
                       { id: group.tag.slug },
                       group.teaserOptions);
      group.teasers.push(t);
      refs.addCls('tag', t);
    }
    break;

  case 'category':
    group.teasers = [];
    for (i = 0; i < group.numTeasers; ++i) {
      t = createTeaser('category',
                       getSize(group.numTeasers, i),
                       '',
                       { id: group.category.id_ },
                       group.teaserOptions);
      group.teasers.push(t);
      refs.addCls('category', t);
    }
    break;

  case 'collection':
    group.teasers = [];
    for (i = 0; i < group.numTeasers; ++i) {
      t = createTeaser('collection',
                       getSize(group.numTeasers, i),
                       '',
                       { id: group.collection.id_ },
                       group.teaserOptions);
      group.teasers.push(t);
      refs.addCls('collection', t);
    }
    break;

  // case 'mixed':
  //   group.teasers.forEach(function(t, i) {
  //     t.span = getSize(group.teasers.length, i);

  //     switch(t.type_) {
  //     case 'chronoTeaser':
  //       t.type = 'chrono';
  //       t.display = 'mixed';
  //       refs.addChrono(t);
  //       break;

  //     case 'pinnedTeaser':
  //       if (t.article.id_) {
  //         t.type = 'pinned';
  //         t.id = t.article.id_;
  //         t.display = 'mixed';
  //         refs.addPinned(t);
  //       } else {
  //         t.type = 'chrono';
  //         t.display = 'mixed';
  //         refs.addChrono(t);
  //       }
  //       break;

  //     case 'tagTeaser':
  //       t.type = 'tag';
  //       t.id = t.tag.slug;
  //       t.display = 'mixed';
  //       refs.addCls('tag', t);
  //       break;

  //     case 'categoryTeaser':
  //       t.type = 'category';
  //       t.id = t.category.id_;
  //       t.display = 'mixed';
  //       refs.addCls('category', t);
  //       break;

  //     case 'collectionTeaser':
  //       t.type = 'collection';
  //       t.id = t.collection.id_;
  //       t.display = 'mixed';
  //       refs.addCls('collection', t);
  //       break;
  //     }
  //   });
  //   break;
  }
}


function collectStageRefs(stage) {

  var refs = createRefs();

  stage.groups.forEach(function(group) {
    collectGroupRefs(group, refs);
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

function mergeRefs(refs, docs, usedIds, noDuplicates) {
  var i, j = 0;
  var id;
  var duplicates = [];
  var newRefs = [];
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
  if (!noDuplicates) {
    // fill remaining empty refs with duplicates
    for ( i = 0; i < duplicates.length && j < refs.length; ++i) {
      refs[j].doc = duplicates[i];
      ++j;
    }
  }
}


function mergePinned(refs, docs, usedIds) {
  mergeRefs(refs, docs, usedIds);
}


function mergeChrono(refs, docs, usedIds) {
  mergeRefs(refs, docs, usedIds, true);
}


function mergeCls(refsById, docsById, usedIds) {
  _.each(refsById, function(ref, id) {
    mergeRefs(ref, docsById[id], usedIds);
  });
}


function createGroupRows(groups) {

  var group, nextGroup;
  var row = [];
  var spans = 0;
  var seperate;

  for (var i = 0; i < groups.length; ++i) {
    group = groups[i];
    group.rows = [];
    group.teasers.forEach(function(t) {
      row.push(t);
      spans += t.span;
      if (spans >= 6) {
        group.rows.push(row);
        spans = 0;
        row = [];
      }
    });
    if (row.length && spans < 6) {
      group.rows.push(row);
    }

    if (i < groups.length - 1) {
      nextGroup = groups[i+1];
      seperate = true;
      // do not seperate chrono groups
      if (nextGroup.type_ === 'chrono' && group.type_ === 'chrono') seperate = false;
      // do not seperate this group has only one big teaser
      if (group.teasers.length === 1 && group.teasers[0].span === 6) seperate = false;
      // do not seperate when nextgroup has only one big teaser
      if (nextGroup.teasers.length === 1 && nextGroup.teasers[0].span === 6) seperate = false;

      if (seperate) {
        group.display += ' seperate';
      }
    }
  }
}


function setupStage(app, stage, date) {

  date = date || new Date().toISOString();

  var refs = collectStageRefs(stage);
  var teasers = app.models.teasers;

  var order = [];
  if (refs.pinned.length > 0) {
    order.push({ type: 'pinned',
                 promise: loadPinned(teasers.byIds, refs.pinned),
                 merge: mergePinned });
  }
  if (Object.keys(refs.tag).length > 0) {
    order.push({ type: 'tag',
                 promise: loadCls(teasers.byTag, date, refs.tag, 0),
                 merge: mergeCls });
  }
  if (refs.chrono.length > 0) {
    var offsetChrono = refs.pinned.length +
          _.reduce(refs.tag, function(sum, t) {
            return sum + t.length;
          }, 0) + 1;
    order.push({ type: 'chrono',
                 promise: loadChrono(teasers.byClsDate, date, refs.chrono, offsetChrono),
                 merge: mergeChrono });
  }
  if (Object.keys(refs.collection).length > 0) {
    order.push({ type: 'collection',
                 promise: loadCls(teasers.byClsDate, date, refs.collection, 5),
                 merge: mergeCls });
  }
  if (Object.keys(refs.category).length > 0) {
    order.push({ type: 'category',
                 promise: loadCls(teasers.byClsDate, date, refs.category, 5),
                 merge: mergeCls });
  }

  return Q.all(order.map(function(o) { return o.promise; })).then(function(results) {

    var chronoDocs = [];

    // merge docs into refs
    var usedIds = {};
    order.forEach(function(o, i) {
      if (o.type === 'chrono') {
        chronoDocs = results[i];
      }
      o.merge(refs[o.type], results[i], usedIds);
    });

    // remove empty groups
    for (var i = stage.groups.length - 1; i >= 0; --i) {
      var isEmpty = stage.groups[i].teasers.lenght === 0;
      if (!isEmpty) {
        isEmpty = stage.groups[i].teasers.every(function(t) {
          return !t.doc;
        });
      }
      if (isEmpty) {
        stage.groups.splice(i);
      }
    }


    createGroupRows(stage.groups);


    // check if there is a next page
    if (chronoDocs.length > refs.chrono.length && refs.chrono[refs.chrono.length - 1].doc) {
      // console.log('------- more more more');
      var lastDocId = refs.chrono[refs.chrono.length - 1].doc._id;
      var i = 0, nextDate;
      while (!nextDate && i < chronoDocs.length) {
        nextDate = chronoDocs[i]._id === lastDocId ? chronoDocs[i].date : null;
        ++i;
      }
      console.log('------- nextDate', nextDate);
      stage.nextDate = nextDate;
    }

    //console.log('--------- stage', Util.inspect(stage, { depth: 4 }));
    return stage;
  });
};



module.exports = {
  createTeaser: createTeaser,
  createGroup: createGroup,

  setupStage: setupStage
};