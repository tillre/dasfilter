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

  .object({
    title: J.string().default('Start').custom('view', { type: 'cr-readonly' }),
    layout: J.array(J.anyOf(

      // chronological

      J.object({
      }).custom('name', 'chrono-oneway'),

      J.object({
        display: J.enum('default', 'uneven')
      }).custom('name', 'chrono-twoway'),

      J.object({
      }).custom('name', 'chrono-threeway'),

      // pins

      J.object({
        title: J.string(),
        article: J.articleRef()
      }).custom('name', 'pinned-oneway'),

      J.object({
        title: J.string(),
        articles: J.object({
          one: J.articleRef(),
          two: J.articleRef()
        }).custom('view', { type: 'cr-column-object', showLabel: false, indent: false })
      }).custom('name', 'pinned-twoway'),

      J.object({
        title: J.string(),
        articles: J.object({
          one: J.articleRef(),
          two: J.articleRef(),
          three: J.articleRef()
        }).custom('view', { type: 'cr-column-object', showLabel: false, indent: false })
      }).custom('name', 'pinned-threeway'),

      // tags

      J.object({
        title: J.string(),
        tag: J.object({
          name: J.string(),
          slug: J.string()
        }).custom('view', { type: 'cr-select-tag' })
      }).custom('name', 'tag-oneway'),

      J.object({
        title: J.string(),
        tag: J.object({
          name: J.string(),
          slug: J.string()
        }).custom('view', { type: 'cr-select-tag' })
      }).custom('name', 'tag-twoway'),

      J.object({
        title: J.string(),
        tag: J.object({
          name: J.string(),
          slug: J.string()
        }).custom('view', { type: 'cr-select-tag' })
      }).custom('name', 'tag-threeway')

    ))
  })
;