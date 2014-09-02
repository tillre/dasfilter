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
    collection: {},
    contributor: {}
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


function addGroup(type, id, url, wireframeGroup, refs) {
  var layoutGroup = _.clone(wireframeGroup);
  layoutGroup.id = id;
  layoutGroup.teasers = layoutGroup.teasers || [];
  if (url) {
    layoutGroup.link = url;
  }
  for (var i = 0; i < wireframeGroup.numTeasers; ++i) {
    var t = createTeaser(type, getSize(wireframeGroup.numTeasers, i));
    layoutGroup.teasers.push(t);
    refs.addCls(type, id, t);
  }
  return layoutGroup;
}

function buildGroup(app, classes, wireframeGroup, refs) {
  var id;
  var layoutGroup;

  switch(wireframeGroup.type_) {
  case 'chrono':
    layoutGroup = _.clone(wireframeGroup);
    layoutGroup.teasers = [];
    for (var t, i = 0; i < wireframeGroup.numTeasers; ++i) {
      t = createTeaser('chrono', getSize(wireframeGroup.numTeasers, i));
      layoutGroup.teasers.push(t);
      refs.addChrono(t);
    }
    break;

  case 'pinned':
    layoutGroup = _.clone(wireframeGroup);
    layoutGroup.teasers = wireframeGroup.teasers.map(function(t, i) {
      t.span = getSize(wireframeGroup.teasers.length, i);
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
    id = wireframeGroup.tag ? wireframeGroup.tag.slug : null;
    if (!id) break;
    layoutGroup = addGroup('tag', id,
                           app.urls.tag(wireframeGroup.tag),
                           wireframeGroup, refs);
    break;

  case 'category':
    id = wireframeGroup.category.id_ || wireframeGroup.category._id;
    if (!id) break;
    layoutGroup = addGroup('category', id,
                           app.urls.classification(classes.byId[id]),
                           wireframeGroup, refs);
    break;

  case 'collection':
    id = wireframeGroup.collection.id_ || wireframeGroup.collection._id;
    if (!id) break;
    layoutGroup = addGroup('collection', id,
                           app.urls.classification(classes.byId[id]),
                           wireframeGroup, refs);
    break;

  case 'contributor':
    id = wireframeGroup.contributor.id_ || wireframeGroup.contributor._id;
    if (!id) break;
    layoutGroup = addGroup('contributor', id, '', wireframeGroup, refs);
    break;
  }
  return layoutGroup;
}


function createLayout(app, classes, wireframe) {
  var layout = {
    refs: createRefs()
  };

  layout.groups = wireframe.groups.reduce(function(acc, group) {
    var g = buildGroup(app, classes, group, layout.refs);
    if (g) acc.push(g);
    return acc;
  }, []);

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

      // do not seperate cls groups of same type and with same id
      if (group.id && nextGroup.type_ === group.type_ && nextGroup.id === group.id) {
        seperate = false;
      }

      // do not seperate pinned groups when next has no title
      if (group.type_ === 'pinned' && nextGroup.type_ === 'pinned' && !nextGroup.title) {
        seperate = false;
      }

      if (seperate) {
        group.display += ' seperate';
      }
      if (pullUp) {
        group.display += ' pull-up';
      }
    }
  });
}



function buildLayout(app, classes, wireframe, date, usedIds) {

  date = date || new Date().toISOString();
  usedIds = usedIds || {};

  var l = createLayout(app, classes, wireframe);
  var teasers = app.models.teasers;

  var order = [];
  if (l.refs.pinned.length > 0) {
    order.push({ type: 'pinned',
                 promise: loadPinned(teasers.byIds, l.refs.pinned),
                 merge: mergeRefs });
  }
  if (Object.keys(l.refs.tag).length > 0) {
    order.push({ type: 'tag',
                 promise: loadCls(teasers.byTag, date, l.refs.tag, 1),
                 merge: mergeCls });
  }
  if (l.refs.chrono.length > 0) {
    var offsetChrono = l.refs.pinned.length +
          _.reduce(l.refs.tag, function(sum, t) {
            return sum + t.length;
          }, 0) + 1;
    order.push({ type: 'chrono',
                 promise: loadChrono(teasers.byClsDate, date, l.refs.chrono, offsetChrono),
                 merge: mergeRefs });
  }
  if (Object.keys(l.refs.contributor).length > 0) {
    order.push({ type: 'contributor',
                 promise: loadCls(teasers.byContributorDate, date, l.refs.contributor, 1),
                 merge: mergeCls });
  }
  if (Object.keys(l.refs.collection).length > 0) {
    order.push({ type: 'collection',
                 promise: loadCls(teasers.byClsDate, date, l.refs.collection, 5),
                 merge: mergeCls });
  }
  if (Object.keys(l.refs.category).length > 0) {
    order.push({ type: 'category',
                 promise: loadCls(teasers.byClsDate, date, l.refs.category, 5),
                 merge: mergeCls });
  }

  var promises = order.map(function(o) { return o.promise; });

  return Q.all(promises).then(function(results) {

    // merge docs into refs
    order.forEach(function(o, i) {
      o.merge(l.refs[o.type], results[i], usedIds);
    });

    // remove empty groups and docs
    l.groups = filterEmpty(l.groups);
    // partition teasers into rows
    createGroupRows(l.groups);

    return l;
  });
};



module.exports = {
  createTeaser: createTeaser,
  createGroup: createGroup,

  build: buildLayout
};