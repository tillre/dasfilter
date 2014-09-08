var Util = require('util');
var Q = require('kew');
var _ = require('lodash');


function createRefs() {
  var refs = {
    chrono: [],
    pinned: [],
    tag: {},
    category: {},
    collection: {},
    contributor: {}
  };

  function addClsRef(type, id, teaser) {
    if (!refs[type][id]) {
      refs[type][id] = [teaser];
    } else {
      refs[type][id].push(teaser);
    }
  }

  var createTeaser = {
    chrono: function(group) {
      var t = { type: group.type_ };
      refs[group.type_].push(t);
      return t;
    },
    pinned: function(group, i) {
      var id = group.teasers.length > i && group.teasers[i].article.id_
            ? group.teasers[i].article.id_ : null;
      if (!id) return null;
      var t = { type: group.type_, id: id };
      refs[group.type_].push(t);
      return t;
    },
    category: function(group) {
      var id = group.category.id_ || group.category._id;
      if (!id) return null;
      var t = { type: group.type_, id: id };
      addClsRef(group.type_, id, t);
      return t;
    },
    collection: function(group) {
      var id = group.collection.id_ || group.collection._id;
      if (!id) return null;
      var t = { type: group.type_, id: id };
      addClsRef(group.type_, id, t);
      return t;
    },
    tag: function(group) {
      var id = group.tag ? group.tag.slug : null;
      if (!id) return null;
      var t = { type: group.type_, id: id };
      addClsRef(group.type_, id, t);
      return t;
    },
    contributor: function(group) {
      var id = group.contributor.id_ || group.contributor._id;
      if (!id) return null;
      var t = { type: group.type_, id: id };
      addClsRef(group.type_, id, t);
      return t;
    }
  };

  function createTeasers(group) {
    var l = parseInt(group.layout.charAt(0), 10);
    var ts = [];
    var textonly = group.layout.indexOf('textonly') > -1;

    for (var t, i = 0; i < l; ++i) {
      t = createTeaser[group.type_](group, i);
      if (t) {
        t.textonly = textonly;
        ts.push(t);
      }
    }
    return ts;
  }

  refs.createTeasers = createTeasers;
  return refs;
};


function createRow(app, classes, group, refs) {
  var row = {
    type: group.type_,
    teasers: refs.createTeasers(group),
    classes: 'row-' + group.layout
  };
  if (group.title) row.title = group.title;

  switch(row.type) {
  case 'category':
    row.id = group.category.id_ || group.category._id;
    if (row.id) {
      row.link = app.urls.classification(classes.byId[row.id]);
    }
    break;
  case 'collection':
    row.id = group.collection.id_ || group.collection._id;
    if (row.id) {
      row.link = app.urls.classification(classes.byId[row.id]);
    }
    break;
  case 'tag':
    row.id = group.tag.slug;
    if (row.id) {
      row.link = app.urls.tag(group.tag);
    }
    break;
  case 'contributor':
    row.id = group.contributor.id_ || group.contributor._id;
    break;
  }
  return row;
}


function createLayout(app, classes, wireframe) {
  var refs = createRefs();
  var layout = {
    refs: refs,
    rows: wireframe.groups.map(function(group) {
      return createRow(app, classes, group, refs);
    }).filter(function(row) {
      return row.teasers.length > 0;
    })
  };

  var row, nextRow;
  for (var i = 0; i < layout.rows.length - 1; ++i) {
    row = layout.rows[i];
    nextRow = layout.rows[i + 1];
    if (!nextRow.title && row.type === nextRow.type) {
      if (row.type === 'chrono') continue;
      if (row.id && row.id === nextRow.id) continue;
    }
    row.classes += ' seperate';
  }

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
  if (l.refs.chrono.length > 0) {
    order.push({ type: 'chrono',
                 promise: loadChrono(teasers.byClsDate, date, l.refs.chrono, l.refs.pinned.length),
                 merge: mergeRefs });
  }
  if (Object.keys(l.refs.tag).length > 0) {
    order.push({ type: 'tag',
                 promise: loadCls(teasers.byTag, date, l.refs.tag, 10),
                 merge: mergeCls });
  }
  if (Object.keys(l.refs.contributor).length > 0) {
    order.push({ type: 'contributor',
                 promise: loadCls(teasers.byContributorDate, date, l.refs.contributor, 1),
                 merge: mergeCls });
  }
  if (Object.keys(l.refs.collection).length > 0) {
    order.push({ type: 'collection',
                 promise: loadCls(teasers.byClsDate, date, l.refs.collection, 10),
                 merge: mergeCls });
  }
  if (Object.keys(l.refs.category).length > 0) {
    order.push({ type: 'category',
                 promise: loadCls(teasers.byClsDate, date, l.refs.category, 10),
                 merge: mergeCls });
  }

  var promises = order.map(function(o) { return o.promise; });

  return Q.all(promises).then(function(results) {
    // merge docs into refs
    order.forEach(function(o, i) {
      o.merge(l.refs[o.type], results[i], usedIds);
    });
    return l;
  });
};


module.exports = buildLayout;
