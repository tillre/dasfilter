//
// Create contributor slug from firstname and lastname
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

var resources;

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  var slug = '';
  var map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
              '/': '-', '_': '-', ',': '-', ':': '-', ';': '-', '.': '-' };

  for (var i = 0; i < str.length; ++i) {
    var c = str.charAt(i);
    slug += map[c] || c;
  }

  slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, ''); // trim dashes

  return slug;
}


console.log('loading resource definitions');
Load(db).then(function(res) {
  resources = res.cores.resources;

  console.log('create contributor slug');
  return resources.Contributor.map(
    'all',
    { include_docs: true },
    function(doc) {
      doc.slug = slugify(doc.firstname + ' ' + doc.lastname);
      return doc;
    }
  );

}).then(function(result) {
  console.log('migration success');

}).fail(function(err) {
  console.log('error', err);
});