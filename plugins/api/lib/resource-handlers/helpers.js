var Hapi = require('hapi');


//
// Check if a property value is unique for a given view result
//
function checkUniqueness(resource, view, path, value) {

  return resource.view(view, { key: value }).then(function(result) {

    if (result.rows.length !== 0) {
      var err = new Error(value + ' is not unique');
      err.errors = [{ message: err.message, path: path, code: 409 }];
      err.code = 409;
      throw err;
    }
    return true;
  });
}


function checkCreateSlug(resource, doc) {
  return checkUniqueness(resource, 'by_slug', 'slug', doc.slug).then(function() {
    return doc;
  });
}


function checkUpdateSlug(resource, doc) {
  return resource.load(doc._id).then(function(oldDoc) {
    if (oldDoc.slug !== doc.slug) {
      return checkUniqueness(resource, 'by_slug', 'slug', doc.slug).then(function() {
        return doc;
      });
    }
    else {
      return doc;
    }
  });
}


module.exports = {
  checkUniqueness: checkUniqueness,
  checkCreateSlug: checkCreateSlug,
  checkUpdateSlug: checkUpdateSlug
};
