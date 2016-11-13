var Util = require('util');

module.exports = function(resources) {

  //
  // Get all teasers for a given category or '*' for all categories
  //

  function getTeasers(view, qs) {

    // the view emits the article itself plus dependent resources
    // these will be put together again from the resulting rows

    var orgLimit = qs.limit;
    
    // extend the limit times (doc + number of resource parts)
    if (qs.limit) {
      qs.limit *= 4;
    }

    return resources.Article.view(view, qs).then(function(result) {
      var teasers = [];
      var assets = {};

      result.rows.forEach(function(row) {
        if (!assets[row.id]) {
          assets[row.id] = {};
        }
        if (row.doc.type_ === 'Article') {
          teasers.push(row.doc);
        }
        else {
          assets[row.id][row.doc.type_] = row.doc;
        }
      });

      teasers.forEach(function(t) {
        var as = assets[t._id];
        if (as.Contributor) {
          t.contributors[0].contributor = as.Contributor;
        }
        t.classification.category = as.Category;
        t.header.image = as.Image;
      });

      // slice to original limit, because there may have been docs with fewer assets
      // and the boosted limit will then return more actual article docs
      return teasers.slice(0, orgLimit);
    });
  }


  return {
    byIds: function(keys) {
      return getTeasers('teaser_by_id', {
        include_docs: true,
        keys: keys
      });
    },

    byClsDate: function(clsKey, startDate, limit, reverse) {
      var startkey = ['published', clsKey, startDate];
      var endkey = ['published', clsKey];
      var descending = true;

      if (reverse) {
        endkey.push({});
        descending = false;
      }

      return getTeasers('teaser_by_state_cls_date', {
        include_docs: true,
        descending: descending,
		    limit: limit,
		    startkey: startkey,
		    endkey: endkey
      });
    },

    byTag: function(tagSlug, startDate, limit) {
      return getTeasers('teaser_by_state_tag_date', {
        include_docs: true,
        descending: true,
        limit: limit,
        endkey: ['published', tagSlug],
        startkey: ['published', tagSlug, startDate]
      });
    },

    byContributorDate: function(contributorId, startDate, limit) {
      return getTeasers('teaser_by_state_contributor_date', {
        include_docs: true,
        descending: true,
        limit: limit,
        endkey: ['published', contributorId],
        startkey: ['published', contributorId, startDate]
      });
    }
  };
};