var J = require('jski')();

module.exports = J

  .object({
    title: J.string(),
    articles: J.array(
      J.ref('Article').custom('view', {
        showLabel: false,
        selectOnly: true,
        previewPaths: ['/title'],
        list: {
          columns: [{ path: 'title' }]
        }
      }).custom('name', 'article')
    )

  }).required('title')
;
