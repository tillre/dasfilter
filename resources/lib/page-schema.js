var J = require('jski')();
var ContentSchema = require('./_content-schema.js');


module.exports = J

  .object({
    title: J.string(),
    subtitle: J.string(),

    slug: J.string().format('slug'),

    sections: ContentSchema.content()

  }).required('title', 'slug');
;
