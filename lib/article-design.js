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

    teaser_by_state_cls_date: {
      map: function(doc) {
        function emitForCls(clsKey) {
          emit([doc.state, clsKey, doc.date, 0]);
          emit([doc.state, clsKey, doc.date, 1], { _id: doc.header.image.id_ });
          emit([doc.state, clsKey, doc.date, 2], { _id: doc.classification.category.id_ });
          if (doc.contributors.length > 0) {
            emit([doc.state, clsKey, doc.date, 3], { _id: doc.contributors[0].contributor.id_ });
          }
          else {
            emit([doc.state, clsKey, doc.date, 3], false);
          }
        }

        if (doc.type_ === 'Article') {
          emitForCls('*');
          emitForCls(doc.classification.category.id_);

          doc.classification.collections.forEach(function(col) {
            emitForCls(col.id_);
          });
        }
      }
    },

    by_slug: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit(doc.slug, null);
        }
      }
    }
  }
};
