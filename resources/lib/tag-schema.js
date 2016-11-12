var J = require('jski')();

module.exports = J.object({

  name: J.string(),
  slug: J.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: 'name' })

}).required('name', 'slug');