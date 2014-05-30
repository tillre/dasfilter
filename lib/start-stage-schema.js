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

      J.object({
        article: J.articleRef(),
        size: J.enum('default', 'full')
      }).custom('name', 'oneway'),

      J.object({
        articles: J.object({
          one: J.articleRef(),
          two: J.articleRef()
        }).custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),
        size: J.enum('default', 'full')
      }).custom('name', 'twoway'),

      J.object({
        articles: J.object({
          one: J.articleRef(),
          two: J.articleRef(),
          three: J.articleRef()
        }).custom('view', { type: 'cr-column-object', showLabel: false, indent: false }),
        size: J.enum('default', 'full')
      }).custom('name', 'threeway')

    ))
  })
;