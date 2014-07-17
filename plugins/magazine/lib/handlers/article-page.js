var Util = require('util');


function articleBelongsToClassification(doc, clsId, clsType) {
  if (clsType === 'Category') {
    return (doc.classification.category._id === clsId);
  }
  else {
    return doc.collections.some(function(col) {return col._id === clsId; });
  }
}


function prepareArticle(app, doc) {

  var cs = app.definitions._Content.schema;
  var oneway = cs.contentOnewaySection();

  // integrate the teaser text object
  var textSchema = cs.contentText();
  var teaser = cs.createValue(textSchema);
  teaser.text = doc.teaser;
  teaser.type_ = 'teaser';

  // create a new section
  var teaserSection = cs.createValue(oneway);
  teaserSection.type_ = oneway.custom('name');
  teaserSection.one.push(teaser);
  doc.sections.unshift(teaserSection);

  return doc;
}


//
// article handler
//
module.exports = function(app) {

  return function articleHandler(request, reply) {

    app.models.classifications.getAll().then(function(classes) {
      var cls = classes.allBySlug[request.params.classification];

      if (!cls) {
        var err = new Error('Category or Collection not found: ' + request.params.classification);
        err.code = 404;
        throw err;
      }

      return app.models.articles.bySlug(request.params.article).then(function(doc) {

        // get related teaser
        return app.models.teasers.byClsDate(
          doc.classification.category._id,
          doc.date,
          3

        ).then(function(docs) {
          var teaser = docs.map(function(doc) {
            return {
              display: 'light',
              span: 2,
              doc: doc
            };
          });
          if (articleBelongsToClassification(doc, cls._id, cls.type_)) {
            app.replyView(request, reply, 'article-page', {
              article: prepareArticle(app, doc),
              classification: cls,
              classifications: classes,
              related: teaser
            });
          }
          else {
            reply('You are being redirected').redirect(
              app.urls.article(doc.classification.category, doc)
            );
          }
        });
      });

    }).fail(function(err) {
      reply(err);
    });
  };
};
