var J = require('jski')();

module.exports = J.object({

  title: J.string(),
  slug: J.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: 'title' }),

  images: J.array(
    J.object({
      image: J.ref('Image').custom('view', {
        preview: 'cr-image-preview',
        defaults: { '/family': 'gallery' },
        list: {
          columns: [{ path: 'title' }, { path: 'file/url' }],
          view: 'by_family_date',
          params: {
            startkey: ['gallery', {}], endkey: ['gallery'], descending: true
          }
        }
      }),
      caption: J.string()
    })
  )

}).required('title', 'slug');