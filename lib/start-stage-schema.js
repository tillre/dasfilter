var J = require('jski')();


module.exports = J

  .mixin('articleRef',
         J.ref('Article').custom('view', {
           showLabel: false,
           selectOnly: true,
           enableClear: true,
           previewPaths: ['/title', '/subtitle'],
           list: {
             columns: [{ path: 'title' }, { path: 'subtitle'}]
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

  .mixin('chronoTeaser',
         J.object({
         }).custom('name', 'chronoTeaser'))

  .mixin('pinnedTeaser',
          J.object({
            title: J.string(),
            article: J.articleRef()
          }).custom('name', 'pinnedTeaser'))

  .mixin('tagTeaser',
          J.object({
            title: J.string(),
            tag: J.tagSelect()
          }).custom('name', 'tagTeaser'))

  .mixin('categoryTeaser',
          J.object({
            title: J.string(),
            category: J.categorySelect()
          }).custom('name', 'categoryTeaser'))

  .mixin('collectionTeaser',
          J.object({
            title: J.string(),
            collection: J.collectionSelect()
          }).custom('name', 'collectionTeaser'))


  .object({
    title: J.string().default('Start').custom('view', { type: 'cr-readonly' }),
    groups: J.array(J.anyOf(

      J.object({
        display: J.enum('default', 'full').custom('view', { type: 'cr-readonly' }),
        numTeasers: J.integer()
      }).custom('name', 'chrono'),

      J.object({
        title: J.string(),
        display: J.enum('default', 'full'),
        teasers: J.array(J.object({
          article: J.articleRef()
        }))
      }).custom('name', 'pinned'),

      J.object({
        title: J.string(),
        display: J.enum('default', 'full'),
        tag: J.tagSelect(),
        numTeasers: J.integer()
      }).custom('name', 'tag'),

      J.object({
        title: J.string(),
        display: J.enum('default', 'full'),
        category: J.categorySelect(),
        numTeasers: J.integer()
      }).custom('name', 'category'),

      J.object({
        title: J.string(),
        display: J.enum('default', 'full'),
        collection: J.collectionSelect(),
        numTeasers: J.integer()
      }).custom('name', 'collection'),

      J.object({
        title: J.string(),
        display: J.enum('default', 'full').custom('view', { type: 'cr-readonly' }),
        teasers: J.array(J.anyOf(
          J.chronoTeaser(),
          J.pinnedTeaser(),
          J.tagTeaser(),
          J.categoryTeaser(),
          J.collectionTeaser()
        ))
      }).custom('name', 'mixed')

    ))
  })
;
