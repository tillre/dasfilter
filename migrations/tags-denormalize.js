//
// This script denormalizes the tags inside the articles
// It replaces the references with the actual tag data in each article
//
var Cores = require('cores');
var Load = require('../index.js');

var db = {
  url: process.env.DF_DB_URL,
  user: process.env.DF_DB_USER,
  pass: process.env.DF_DB_PASS
};
if (!db.url) {
  throw new Error('no db url, set env var DF_DB_URL');
}
var cores = Cores(db);
var defs, tagRes, articleRes;
var tagsMap = {};


console.log('loading resource definitions');
Load().then(function(d) {
  defs = d;
  console.log('creating Tag resource');
  return cores.create('Tag', defs.Tag);

}).then(function(tr) {
  tagRes = tr;
  console.log('creating Article resource');
  return cores.create('Article', defs.Article);

}).then(function(ar) {
  articleRes = ar;
  console.log('loading all tags');
  return tagRes.view('all', { include_docs: true });

}).then(function(ts) {
  console.log('loaded', ts.rows.length, 'number of tags');
  ts.rows.forEach(function(row) {
    tagsMap[row.id] = row.doc;
  });

  console.log('replace tag refs in articles with actual tag data');
  return articleRes.map('all', { include_docs: true }, function(doc) {
    var docTags = doc.classification.tags;
    var newTags = [];
    if (!docTags) {
      return doc;
    }
    var i = 0;
    for(var i = 0; i < docTags.length; ++i) {
      var t = tagsMap[docTags[i].id_];
      if (!t) {
        console.log('no Tag found for id', docTags[i].id_ ,'in', doc.title, doc.subtitle);
      }
      else {
        newTags.push({ name: t.name, slug: t.slug });
      }
    }
    doc.classification.tags = newTags;
    return doc;
  });

}).then(function() {
  console.log('migration success');

}).fail(function(err) {
  console.log(err);
});