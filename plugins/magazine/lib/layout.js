var Util = require('util');
var Q = require('kew');
var _ = require('lodash');


// get the span size of a teaser according to group size and index of teaser
function getSize(groupSize, i) {
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


function createGroup(type, display, options) {
  return _.merge({
    type_: type,
    display: display || '',
    teasers: []
  }, options);
}


function createTeaser(type, span, options) {
  return _.merge({
    type: type,
    span: span
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

    addCls: function(type, id, ref) {
      if (!refs[type][id]) {
        refs[type][id] = [ref];
      }
      else {
        refs[type][id].push(ref);
      }
    }
  });
}


function buildGroup(app, classes, stageGroup, refs) {
  var i, t, id;
  var layoutGroup = _.clone(stageGroup);
  layoutGroup.teasers = layoutGroup.teasers || [];

  switch(stageGroup.type_) {
  case 'chrono':
    for (i = 0; i < stageGroup.numTeasers; ++i) {
      t = createTeaser('chrono',
                       getSize(stageGroup.numTeasers, i));
      layoutGroup.teasers.push(t);
      refs.addChrono(t);
    }
    break;

  case 'pinned':
    layoutGroup.teasers = stageGroup.teasers.map(function(t, i) {
      t.span = getSize(stageGroup.teasers.length, i);
      if (t.article.id_) {
        t.type = 'pinned';
        t.id = t.article.id_;
        refs.addPinned(t);
      } else {
        t.type = 'chrono';
        refs.addChrono(t);
      }
      return t;
    });
    break;

  case 'tag':
    layoutGroup.link = app.urls.tag(stageGroup.tag);
    for (i = 0; i < stageGroup.numTeasers; ++i) {
      t = createTeaser('tag',
                       getSize(stageGroup.numTeasers, i));
      layoutGroup.teasers.push(t);
      refs.addCls('tag', stageGroup.tag.slug, t);
    }
    break;

  case 'category':
    id = stageGroup.category.id_ || stageGroup.category._id;
    layoutGroup.link = app.urls.classification(classes.byId[id]);
    for (i = 0; i < stageGroup.numTeasers; ++i) {
      t = createTeaser('category',
                       getSize(stageGroup.numTeasers, i));
      layoutGroup.teasers.push(t);
      refs.addCls('category', id, t);
    }
    break;

  case 'collection':
    id = stageGroup.collection.id_ || stageGroup.collection._id;
    layoutGroup.link = app.urls.classification(classes.byId[id]);
    for (i = 0; i < stageGroup.numTeasers; ++i) {
      t = createTeaser('collection',
                       getSize(stageGroup.numTeasers, i));
      layoutGroup.teasers.push(t);
      refs.addCls('collection', id, t);
    }
    break;
  }
  return layoutGroup;
}


function createLayout(app, classes, stage) {

  var layout = {
    refs: createRefs()
  };

  layout.groups = stage.groups.map(function(group) {
    return buildGroup(app, classes, group, layout.refs);
  });

  return layout;
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
  var newRefs = [];
  // merge previously unused docs
  for (i = 0; i < docs.length && j < refs.length; ++i) {
    id = docs[i]._id;
    if (usedIds[id]) {
      continue;
    }
    refs[j].doc = docs[i];
    usedIds[id] = true;
    ++j;
  }

  // add nextdate if we have not run out of docs
  if (j === refs.length && docs.length > refs.length) {
    refs.nextDate = docs[refs.length - 1].date;
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


function filterEmpty(groups) {
  return groups.filter(function(g) {
    g.teasers = g.teasers.filter(function(t) {
      return t.doc;
    });
    return g.teasers.length > 0;
  });
}


function createGroupRows(groups) {

  groups.forEach(function(group, i) {

    group.rows = [];
    var row = [];
    var spans = 0;
    var textonly = group.display.indexOf('textonly') !== -1;

    // build rows with max span size of 6
    group.teasers.forEach(function(t) {
      if (textonly) {
        t.textonly = true;
      }
      row.push(t);
      spans += t.span;
      if (spans >= 6) {
        group.rows.push(row);
        spans = 0;
        row = [];
      }
    });
    // add last row
    if (row.length && spans < 6) {
      group.rows.push(row);
    }

    // set classes for margins/lines between groups
    if (i < groups.length - 1 && !group.hasOwnProperty('seperate')) {
      var nextGroup = groups[i+1];
      var seperate = true;
      var pullUp = false;

      // do not seperate chrono groups
      if (nextGroup.type_ === 'chrono' && group.type_ === 'chrono') {
        seperate = false;
        if (group.teasers.length === 1 && group.teasers[0].span === 6) {
          pullUp = true;
        }
      }

      // do not seperate if this group has only one big teaser and is not textonly
      if (group.teasers.length === 1 &&
          group.teasers[0].span === 6 &&
          !textonly) seperate = false;

      // do not seperate when nextgroup has only one big teaser and no title
      if (nextGroup.teasers.length === 1 &&
          nextGroup.teasers[0].span === 6 &&
          !nextGroup.title) seperate = false;

      if (seperate) {
        group.display += ' seperate';
      }
      if (pullUp) {
        group.display += ' pull-up';
      }
    }
  });
}



function buildLayout(app, classes, stage, date, usedIds) {

  date = date || new Date().toISOString();
  usedIds = usedIds || {};

  var layout = createLayout(app, classes, stage);
  var teasers = app.models.teasers;

  var order = [];
  if (layout.refs.pinned.length > 0) {
    order.push({ type: 'pinned',
                 promise: loadPinned(teasers.byIds, layout.refs.pinned),
                 merge: mergePinned });
  }
  if (Object.keys(layout.refs.tag).length > 0) {
    order.push({ type: 'tag',
                 promise: loadCls(teasers.byTag, date, layout.refs.tag, 1),
                 merge: mergeCls });
  }
  if (layout.refs.chrono.length > 0) {
    var offsetChrono = layout.refs.pinned.length +
          _.reduce(layout.refs.tag, function(sum, t) {
            return sum + t.length;
          }, 0) + 1;
    order.push({ type: 'chrono',
                 promise: loadChrono(teasers.byClsDate, date, layout.refs.chrono, offsetChrono),
                 merge: mergeChrono });
  }
  if (Object.keys(layout.refs.collection).length > 0) {
    order.push({ type: 'collection',
                 promise: loadCls(teasers.byClsDate, date, layout.refs.collection, 5),
                 merge: mergeCls });
  }
  if (Object.keys(layout.refs.category).length > 0) {
    order.push({ type: 'category',
                 promise: loadCls(teasers.byClsDate, date, layout.refs.category, 5),
                 merge: mergeCls });
  }

  var promises = order.map(function(o) { return o.promise; });

  return Q.all(promises).then(function(results) {

    // merge docs into refs
    order.forEach(function(o, i) {
      o.merge(layout.refs[o.type], results[i], usedIds);
    });

    // remove empty groups and docs
    layout.groups = filterEmpty(layout.groups);
    // partition teasers into rows
    createGroupRows(layout.groups);

    return layout;
  });
};



module.exports = {
  createTeaser: createTeaser,
  createGroup: createGroup,

  build: buildLayout
};