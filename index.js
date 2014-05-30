var Q = require('kew');
var Request = require('request');


function checkError(err, req, res, body) {
  if (err) {
    return err;
  }
  if (res.statusCode < 400) {
    return null;
  }
  var payload = typeof body === 'string' ? JSON.parse(body) : body;
  var cErr = new Error(payload.reason || 'couch returned ' + res.statusCode);
  cErr.statusCode = res.statusCode,
  cErr.request = req;
  cErr.response = res;
  return cErr;
}


module.exports = function(apiUrl, apiUser, apiPass) {

  //
  // get base configuration
  //
  function getConfig() {
    var defer = Q.defer();
    var req = Request({
      url: apiUrl + '/_config',
      method: 'GET',
      auth: { user: apiUser, pass: apiPass }

    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      defer.resolve(JSON.parse(body));
    });
    return defer.promise;
  }


  //
  // validate user account
  //
  function validateAccount(username, password) {
    var defer = Q.defer();
    var req = Request({
      url: apiUrl + '/accounts/validate',
      method: 'POST',
      auth: { user: apiUser, pass: apiPass },
      json: { username: username, password: password }

    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      defer.resolve(body);
    });
    return defer.promise;
  }


  //
  // Get the start stage
  //
  function getStartStage() {
    var defer = Q.defer();
    var req = Request.get(apiUrl + '/startstages', {
      auth: { user: apiUser, pass: apiPass },
      qs: { include_docs: true }
    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var result = JSON.parse(body);
      if (result.length === 0) {
        return defer.reject('No start stage found');
      }
      defer.resolve(result.rows[0].doc);
    });
    return defer.promise;
  }


  //
  // Get a classification stage by id
  //
  function getClsStage(clsId) {
    var defer = Q.defer();
    var req = Request.get(apiUrl + '/classificationstages/_views/by_classification', {
      auth: { user: apiUser, pass: apiPass },
      qs: {
        include_docs: true,
        include_refs: true,
        key: clsId
      }
    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var payload = JSON.parse(body);
      var stage = payload.rows[0].doc;

      // get articles for auto lists
      var promises = stage.aside.filter(function(item) {
        return item.type_ === 'newest-of-category' || item.type_ === 'newest-of-collection';

      }).map(function(item) {

        item.articles = [];

        getTeasers(
          item.classification.id_,
          new Date().toISOString(),
          item.numArticles

        ).then(function(docs) {
          item.articles = docs;
        });
      });

      Q.all(promises).then(function() {
        defer.resolve(stage);
      }, function(err) {
        defer.reject(err);
      });
    });

    return defer.promise;
  }


  //
  // Get an article by slug
  //
  function getArticleBySlug(slug) {
    var defer = Q.defer();
    var req = Request.get(apiUrl + '/articles/_views/by_slug', {
      auth: { user: apiUser, pass: apiPass },
      qs: {
        include_docs: true,
        include_refs: true,
        key: slug
      }
    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var result = JSON.parse(body);
      if (result.rows.length === 0) {
        var err = new Error('Article not found');
        err.code = 404;
        return defer.reject(err);
      }
      defer.resolve(result.rows[0].doc);
    });

    return defer.promise;
  }


  //
  // get a page by its slug
  //
  function getPageBySlug(slug) {
    var defer = Q.defer();
    var req = Request.get(apiUrl + '/pages/_views/by_slug', {
      auth: { user: apiUser, pass: apiPass },
      qs: {
        include_docs: true,
        include_refs: true,
        key: slug
      }

    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var result = JSON.parse(body);

      if (result.rows.length === 0) {
        var err = new Error('Page not found');
        err.code = 404;
        return defer.reject(err);
      }
      defer.resolve(result.rows[0].doc);
    });

    return defer.promise;
  }


  //
  // Get all categories and classifications
  //
  function getClassifications() {

    function filterByType(rows, type) {
      return rows.filter(function(row) {
        return row.doc.type_ === type;
      }).map(function(row) {
        return row.doc;
      });
    };

    var defer = Q.defer();
    var req = Request.get(apiUrl + '/classifications', {
      auth: { user: apiUser, pass: apiPass },
      qs: { include_docs: true }

    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var result = JSON.parse(body);
      return defer.resolve({
        categories: filterByType(result.rows, 'Category'),
        collections: filterByType(result.rows, 'Collection'),

        bySlug: function(slug) {
          var classes = this.categories.concat(this.collections).filter(function(c) {
            return c.slug === slug;
          });
          return classes.length ? classes[0] : null;
        }
      });
    });

    return defer.promise;
  }


  //
  // Get all teasers for a given category or '*' for all categories
  //
  function getTeasers(view, qs) {

    // the view emits the article itself plus dependent resources
    // these will be put together again from the resulting rows

    var ROW_ARTICLE = 0;
    var ROW_IMAGE = 1;
    var ROW_CATEGORY = 2;
    var ROW_CONTRIBUTOR = 3;
    var NUM_PARTS = 4;

    // extend the limit times each resource part
    if (qs.limit) {
      qs.limit *= NUM_PARTS;
    }
    if (qs.keys) {
      // create seperate keys times each resource part
      var modKeys = [];
      for (var i = 0; i < qs.keys.length; ++i) {
        for (var j = NUM_PARTS; j > 0; --j) {
          modKeys.push([qs.keys[i], j - 1]);
        }
      }
      qs.keys = JSON.stringify(modKeys);
    }

    var defer = Q.defer();
    var req = Request.get(apiUrl + '/articles/_views/' + view, {
      auth: { user: apiUser, pass: apiPass },
      qs: qs
    }, function(err, response, body) {
      err = checkError(err, req, response, body);
      if (err) {
        return defer.reject(err);
      }
      var result = JSON.parse(body);
      var docs = [];
      if (result.rows.length === 0) {
        return defer.resolve(docs);
      }

      var image, category, contributor;
      var sortIndex = result.rows[0].key.length - 1;

      result.rows.forEach(function(row) {
        switch(row.key[sortIndex]) {
        case ROW_CONTRIBUTOR: contributor = row.value ? row.doc : null; break;
        case ROW_CATEGORY:    category = row.doc; break;
        case ROW_IMAGE:       image = row.doc; break;
        case ROW_ARTICLE:
          if (contributor) {
            row.doc.contributors[0].contributor = contributor;
          }
          row.doc.classification.category = category;
          row.doc.header.image = image;
          docs.push(row.doc);
          contributor = null;
          break;
        }
      });
      defer.resolve(docs);
    });
    return defer.promise;
  }

  function getTeasersByIds(keys) {
    return getTeasers('teaser_by_id', {
      include_docs: true,
      keys: keys
    });
  }

  function getTeasersByClsAndDate(clsKey, startDate, limit) {
    return getTeasers('teaser_by_state_cls_date', {
        include_docs: true,
        descending: true,
		    limit: limit,
		    endkey: ['published', clsKey],
		    startkey: ['published', clsKey, startDate]
    });
  }


  return {
    getConfig: getConfig,
    validateAccount: validateAccount,

    getStartStage: getStartStage,
    getClsStage: getClsStage,
    getArticleBySlug: getArticleBySlug,
    getPageBySlug: getPageBySlug,
    getClassifications: getClassifications,
    getTeasers: getTeasers,
    getTeasersByIds: getTeasersByIds,
    getTeasersByClsAndDate: getTeasersByClsAndDate
  };
};
