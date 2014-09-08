var J = require('jski')();


module.exports = J

  .mixin('contentImage',
         J.object({
           image: J.ref('Image').custom('view', {
             preview: 'cr-image-preview',
             showLabel: false,
             defaults: { '/family': 'article' },
             list: {
               columns: [{ path: 'title' }, { path: 'file/url' }],
               view: 'by_family_date',
               params: {
                 startkey: ['article', {}], endkey: ['article'], descending: true
               }
             }
           }),
           caption: J.string(),
           display: J.enum('default', 'inside-left', 'inside-right', 'full')
         }).custom('name', 'image')
        )


  .mixin('contentGallery',
         J.object({
           gallery: J.ref('Gallery').custom('view', {
             showLabel: false,
             previewPaths: ['/title'],
             list: {
               headers: [{ path: 'title' }]
             },
           }),
           caption: J.string(),
           display: J.enum('default', 'inside-left', 'inside-right', 'full')
         }).custom('name', 'gallery'))


  .mixin('contentEmbed',
         J.object({
           embed: J.string().custom('view', { type: 'cr-text', showLabel: false }),
           type: J.enum('default', 'video', 'center'),
           caption: J.string()
         }).custom('name', 'embed'))


  .mixin('contentText',
         J.object({
           text: J.string()
             .custom('view', { type: 'cr-text', showLabel: false, showBorder: false }),
           caption: J.string(),
           display: J.enum('default', 'inside-left', 'inside-right')
         }).custom('name', 'text'))


  .mixin('contentColumn',
         J.array(J.anyOf(
           J.contentText(),
           J.contentImage(),
           J.contentEmbed(),
           J.contentGallery()
         ))
        )

  .mixin('contentOnewaySection',
         J.object({
           one: J.contentColumn().custom('view', { showLabel: false })
         }).custom('name', 'oneway')
        )


  .mixin('contentMultiwayColumn',
         J.object({
           align: J.enum('top', 'middle', 'bottom').custom('view', { showLabel: false }),
           items: J.contentColumn().custom('view', { showLabel: false })
         }).custom('view', { indent: false })
        )


  .mixin('contentTwowaySection',
         J.object({
           one: J.contentMultiwayColumn(),
           two: J.contentMultiwayColumn()
         }).custom('name', 'twoway')
           .custom('view', { type: 'cr-column-object', showLabels: false })
        )

  .mixin('contentThreewaySection',
         J.object({
           one: J.contentMultiwayColumn(),
           two: J.contentMultiwayColumn(),
           three: J.contentMultiwayColumn()
         }).custom('name', 'threeway')
           .custom('view', { type: 'cr-column-object', showLabels: false })
        )

  .mixin('contentFourwaySection',
         J.object({
           one: J.contentMultiwayColumn(),
           two: J.contentMultiwayColumn(),
           three: J.contentMultiwayColumn(),
           four: J.contentMultiwayColumn()
         }).custom('name', 'fourway')
           .custom('view', { type: 'cr-column-object', showLabels: false })
        )

  //
  // main mixin
  //

  .mixin('content',
         J.array(J.anyOf(
           J.contentOnewaySection(),
           J.contentTwowaySection(),
           J.contentThreewaySection(),
           J.contentFourwaySection()
         )).custom('view', { indent: false })
        )
;