var J = require('jski')();


module.exports = function(context) {

  return J.object({

    title: J.string(),

    slug: J.string()
      .format('slug')
      .custom('view', { type: 'cr-slug', source: 'title' }),

    family: J.enum('teaser', 'article', 'gallery', 'stage')
      .custom('view', { type: 'cr-readonly' }),

    file: J.object({
      name: J.string(),
      url: J.string(),
      sizes: J.object({
        name: J.string(),
        url: J.string()
      })
    }).custom('view', { type: 'cr-image', baseUrl: context.imagesUrl + '/' })

  }).required('title', 'slug', 'file');
};
