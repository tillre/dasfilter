module.exports = {

  views: {

    by_state_date: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit([doc.state, doc.date]);
          emit(['all', doc.date]);
        }
      }
    },

    by_state_cls_date: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit([doc.state, doc.classification.category.id_, doc.date]);
          emit(['all', doc.classification.category.id_, doc.date]);

          doc.classification.collections.forEach(function(col) {
            emit([doc.state, col.id_, doc.date]);
            emit(['all', col.id_, doc.date]);
          });
        }
      }
    },

    teaser_by_id: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit([doc._id, 0]);
          emit([doc._id, 1], { _id: doc.header.image.id_ });
          emit([doc._id, 2], { _id: doc.classification.category.id_ });
          if (doc.contributors.length > 0) {
            emit([doc._id, 3], { _id: doc.contributors[0].contributor.id_ });
          }
          else {
            emit([doc._id, 3]);
          }
        }
      }
    },

    teaser_by_state_cls_date: {
      map: function(doc) {
        function emitParts(clsId) {
          emit([doc.state, clsId, doc.date, 0]);
          emit([doc.state, clsId, doc.date, 1], { _id: doc.header.image.id_ });
          emit([doc.state, clsId, doc.date, 2], { _id: doc.classification.category.id_ });
          if (doc.contributors.length > 0) {
            emit([doc.state, clsId, doc.date, 3], { _id: doc.contributors[0].contributor.id_ });
          }
        }

        if (doc.type_ === 'Article') {
          // emit each article for the wildcard cls
          emitParts('*');
          // emit for category
          emitParts(doc.classification.category.id_);
          // emit for all collections
          doc.classification.collections.forEach(function(col) {
            emitParts(col.id_);
          });
        }
      }
    },

    teaser_by_state_tag_date: {
      map: function(doc) {
        if (doc.type_ === 'Article' && doc.classification.tags) {
          doc.classification.tags.forEach(function(tag) {
            var slug = tag.slug;
            emit([doc.state, slug, doc.date, 0]);
            emit([doc.state, slug, doc.date, 1], { _id: doc.header.image.id_ });
            emit([doc.state, slug, doc.date, 2], { _id: doc.classification.category.id_ });
            if (doc.contributors.length > 0) {
              emit([doc.state, slug, doc.date, 3], { _id: doc.contributors[0].contributor.id_ });
            }
          });
        }
      }
    },

    by_tag: {
      // call with reduce=true and group=true to get unique tags
      map: function(doc) {
        if (doc.type_ === 'Article' && doc.classification.tags) {
          doc.classification.tags.forEach(function(tag) {
            emit(tag.slug, tag.name);
          });
        }
      },
      reduce: function(keys, values) {
        return values[0];
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit(doc.slug);
        }
      }
    }
  },

  indexes: {
    list: {
      analyzer: "german",
      index: function(doc) {
        if (doc.type_ === 'Article') {
          index('default', doc.title + ' ' + doc.subtitle + ' ' + doc.teaser);
        }
      }
    }
  }
};
