var J = require('jski')();


module.exports = J

  .mixin('contributorImage',
         J.ref('Image').custom('view', {
           preview: 'cr-image-preview',
           defaults: { '/family': 'article' },
           list: {
             columns: [{ path: 'title' }, { path: 'file/url' }],
             view: 'by_family_date',
             params: { startkey: ['teaser', {}], endkey: ['teaser'], descending: true }
           }
         }))

  .object({
    firstname: J.string(),
    lastname: J.string(),
    slug: J.string()
      .format('slug')
      .custom('view', { type: 'cr-slug', source: ['firstname', 'lastname']}),

    image: J.contributorImage(),
    description: J.string().custom('view', { type: 'cr-text' })

  }).required('slug')
;
