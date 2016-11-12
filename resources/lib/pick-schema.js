var J = require('jski')();

// ------------------------------------------------------------
// ProjectionElements
// ------------------------------------------------------------

// ArticleCollection
// module.exports = J
//   .object({

//   })
// ;
// // Image Teaser
// module.exports = J
//   .object({

//   })
// ;

// ------------------------------------------------------------
// Projections
// ------------------------------------------------------------

// ClassificationProjection


// StartProjection
// module.exports = J
//   .object({
//   })
// ;



module.exports = J

  .object({

    title: J.string(),

    classification: J.object({
      categories: J.array(J.ref('Category')).custom('view', {
        type: 'cr-multi-select-ref',
        previewPath: '/title',
        indent: false
      }),

      collections: J.array(J.ref('Collection')).custom('view', {
        type: 'cr-multi-select-ref',
        previewPath: '/title',
        indent: false
      })
    }).custom('view', {
      type: 'cr-column-object',
      showLabel: false,
      showLabels: false
    }),

    articles: J.array(
      J.ref('Article').custom('view', {
        previewPaths: ['/title'],
        list: {
          columns: [{ path: 'title' }]
        }
      }).custom('name', 'article')
    )

  }).required('title')
;
