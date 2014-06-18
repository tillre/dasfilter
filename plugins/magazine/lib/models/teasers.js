
module.exports = function(resources) {

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

    return resources.Article.view(view, qs).then(function(result) {
      var docs = [];
      if (result.rows.length === 0) {
        return docs;
      }
      var image, category, contributor;
      var sortIndex = result.rows[0].key.length - 1;

      result.rows.forEach(function(row) {
        switch(row.key[sortIndex]) {
        case ROW_CONTRIBUTOR: contributor = row.value ? row.doc : null; break;
        case ROW_CATEGORY:    category = row.doc; break;
        case ROW_IMAGE:       image = row.doc; break;
        case ROW_ARTICLE:
          // article doc has to be the last part for all parts of an article
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
      return docs;
    });
  }


  return {
    byIds: function(keys) {
      return getTeasers('teaser_by_id', {
        include_docs: true,
        keys: keys
      });
    },

    byClsDate: function(clsKey, startDate, limit) {
      return getTeasers('teaser_by_state_cls_date', {
        include_docs: true,
        descending: true,
		    limit: limit,
		    endkey: ['published', clsKey],
		    startkey: ['published', clsKey, startDate]
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
    }
  };
};