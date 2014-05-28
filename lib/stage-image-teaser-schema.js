var J = require('jski')();
var ContentSchema = require('./_content-schema.js');

module.exports = J

  .object({
    title: J.string(),
    url: J.string(),
    image: J.ref('Image').custom('view', {
      preview: 'cr-image-preview',
      showLabel: false,
      defaults: { '/family': 'stage' },
      list: {
        columns: [{ path: 'title' }, { path: 'file/url' }],
        view: 'by_family_date',
        params: {
          startkey: ['stage', {}], endkey: ['stage'], descending: true
        }
      }
    })
  }).required('title', 'image')
;
