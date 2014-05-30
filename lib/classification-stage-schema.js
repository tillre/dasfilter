var J = require('jski')();


module.exports = J
  .object({

    title: J.string().custom('view', { type: 'cr-readonly' }),

    classification: J.object({
      id: J.string(),
      type: J.string()
    }).custom('view', { type: 'none' }),

    aside: J.array(J.anyOf(

      J.object({
        collection: J.ref('StageArticleCollection').custom('view', {
          showLabel: false,
          previewPaths: ['/title'],
          list: {
            columns: [{ path: 'title' }]
          }
        })
      }).custom('name', 'article-collection'),

      J.object({
        teaser: J.ref('StageImageTeaser').custom('view', {
          showLabel: false,
          previewPaths: ['/title'],
          list: {
            columns: [{ path: 'title' }]
          }
        })
      }).custom('name', 'image-teaser'),

      J.object({
        title: J.string(),
        classification: J.ref('Category').custom('view', {
          type: 'cr-single-select-ref',
          previewPath: '/title'
        }),
        numArticles: J.integer().minimum(1).maximum(5).default(3)
          .custom('view', { type: 'none' })
      }).custom('name', 'newest-of-category'),

      J.object({
        title: J.string(),
        classification: J.ref('Collection').custom('view', {
          type: 'cr-single-select-ref',
          previewPath: '/title'
        }),
        numArticles: J.integer().minimum(1).maximum(5).default(3)
          .custom('view', { type: 'none' })
      }).custom('name', 'newest-of-collection')
    ))
  })
;