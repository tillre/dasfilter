var J = require('jski')();

module.exports = J.object({

  title: J.string(),
  slug: J.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: 'title' })

}).required('title', 'slug');