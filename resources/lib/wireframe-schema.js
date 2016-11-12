var J = require('jski')();


module.exports = J

  .mixin('articleRef',
         J.ref('Article').custom('view', {
           showLabel: false,
           selectOnly: true,
           enableClear: true,
           previewPaths: ['/title', '/subtitle'],
           list: {
             columns: [{ path: 'title' }, { path: 'subtitle'}],
             view: 'by_state_date',
             params: {
               startkey: ['published', {}], endkey: ['published'], descending: true
             }
           }
         }).custom('name', 'article'))

  .mixin('tagSelect',
      J.object({
          name: J.string(),
          slug: J.string()
      }).custom('view', { type: 'cr-select-tag' }))

  .mixin('categorySelect',
         J.ref('Category').custom('view', {
           type: 'cr-select-ref',
           previewPath: '/title'
         }))

  .mixin('collectionSelect',
         J.ref('Collection').custom('view', {
           type: 'cr-select-ref',
           previewPath: '/title'
         }))

  .mixin('layout',
         J.enum('1', '1-wide', '1-wide-flat', '1-flat', '1-textonly',
                '2', '2-wide', '2-uneven', '2-textonly',
                '3', '3-textonly'))


  .object({
    slug: J.string().default('start').custom('view', { type: 'cr-readonly' }),
    groups: J.array(J.anyOf(

      J.object({
        layout: J.layout()
      }).custom('name', 'chrono')
        .custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),

      J.object({
        title: J.string(),
        layout: J.layout(),
        teasers: J.array(J.object({
          article: J.articleRef()
        }))
      }).custom('name', 'pinned')
        .custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),

      J.object({
        title: J.string(),
        tag: J.tagSelect(),
        layout: J.layout()
      }).custom('name', 'tag')
        .custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),

      J.object({
        title: J.string(),
        category: J.categorySelect(),
        layout: J.layout()
      }).custom('name', 'category')
        .custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),

      J.object({
        title: J.string(),
        collection: J.collectionSelect(),
        layout: J.layout()
      }).custom('name', 'collection')
        .custom('view', { type: 'cr-column-object', showLabel: false, indent: false })
    ))
  }).required('slug')
;
