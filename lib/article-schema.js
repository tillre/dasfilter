var J = require('jski')();
var ContentSchema = require('./_content-schema.js');


module.exports = J

  .mixin('contributors',
         J.array(
           J.object({
             contributor: J.ref('Contributor').custom('view', {
               type: 'cr-single-select-ref',
               previewPaths: ['/firstname', '/lastname']
             }),
             field: J.string()
           }).custom('view', { inline: true })
         ))


  .mixin('teaserImage',
         J.ref('Image').custom('view', {
           preview: 'cr-image-preview',
           defaults: { '/family': 'teaser' },
           list: {
             columns: [{ path: 'title' }, { path: 'file/url' }],
             view: 'by_family_date',
             params: { startkey: ['teaser', {}], endkey: ['teaser'], descending: true }
           }
         }))


  .mixin('altImage',
         J.ref('Image').custom('view', {
           preview: 'cr-image-preview',
           defaults: { '/family': 'article' },
           list: {
             columns: [{ path: 'title' }, { path: 'file/url' }],
             view: 'by_family_date',
             params: { startkey: ['article', {}], endkey: ['article'], descending: true }
           }
         }))


  .object({
    title: J.string(),
    subtitle: J.string(),

    slug: J.string()
      .format('slug')
      .custom('view', { type: 'cr-slug', source: ['title', 'subtitle']}),

    state: J.enum('draft', 'published'),

    date: J.string()
      .custom('view', { type: 'cr-datetime' }),

    contributors: J.contributors(),

    classification: J.object({
      category: J.ref('Category').custom('view', {
        type: 'cr-single-select-ref',
        previewPath: '/title'
      }),
      collections: J.array(J.ref('Collection')).custom('view', {
        type: 'cr-multi-select-ref',
        previewPath: '/title',
        indent: false
      }),
      tags: J.array(J.ref('Tag'))
        .custom('view', { type: 'cr-tags' }),
      label: J.string()

    }).required('category')
      .custom('view', {
        type: 'cr-tab-object',
        showLabel: false,
        indent: false
      }),

    header: J.object({

      image: J.teaserImage(),

      altImage: J.altImage(),

      embed: J.object({
        embed: J.string().custom('view', {
          type: 'cr-text',
          showLabel: false
        }),
        type: J.enum('default', 'video', 'center')
      }).custom('view', { indent: false }),

      gallery: J.ref('Gallery').custom('view', {
        showLabel: false,
        previewPaths: ['/title'],
        list: {
          columns: [{ path: 'title' }]
        }
      }),

      caption: J.string()

    }).required('image')
      .custom('view', {
        type: 'cr-tab-object',
        showLabel: false,
        indent: false
      }),

    teaser: J.string().custom('view', { type: 'cr-text' }),

    sections: ContentSchema.content()

  }).required('title', 'subtitle', 'slug', 'teaser');
;
