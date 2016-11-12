//
// This replaces the 'spiele' category with the 'kultur' category
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
// var cores = Cores(db);
// var cores, defs, tagRes, articleRes;
// var tagsMap = {};

var resources;

console.log('loading resource definitions');
Load(db).then(function(res) {
  resources = res.cores.resources;

  console.log('load all categories');
  return resources.Category.view('all', { include_docs: true });

}).then(function(result) {
  result.rows.forEach(function(row) {
    if (row.doc.title === 'Spiele') {
      gameCat = row.doc;
    }
    if (row.doc.title === 'Kultur') {
      cultureCat = row.doc;
    }
  });
  if (!gameCat) throw new Error('spiele category not found');
  if (!cultureCat) throw new Error('kultur category not found');

  console.log('switch categories and save articles');
  var gameCat;
  var cultureCat;
  return resources.Article.map(
    'by_state_cls_date',
    { startkey: ['all', gameCat._id],
      endkey: ['all', gameCat._id, {}],
      include_docs: true },
    function(doc) {
      doc.classification.category.id_ = cultureCat._id;
      return doc;
    }
  );

}).then(function(result) {
  console.log('migration success');

}).fail(function(err) {
  console.log('error', err);
});