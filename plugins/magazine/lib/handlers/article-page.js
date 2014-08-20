var Util = require('util');
var Q = require('kew');
var Layout = require('../layout.js');


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

    var classes, cls;
    var doc, prevDoc, nextDoc;

    app.models.classifications.getAll().then(function(cs) {
      classes = cs;
      return app.models.articles.bySlug(request.params.article);

    }).then(function(d) {
      doc = d;
      cls = classes.bySlug[request.params.classification];

      if (!articleBelongsToClassification(doc, cls._id, cls.type_)) {
        reply('You are being redirected').redirect(
          app.urls.article(doc.classification.category, doc)
        );
        return [];
      }

      // get next and prev article
      return Q.all([
        app.models.teasers.byClsDate('*', doc.date, 2, true),
        app.models.teasers.byClsDate('*', doc.date, 2)
      ]);

    }).then(function(result) {

      if (result[0].length > 1) {
        prevDoc = result[0][1];
        if (new Date(prevDoc.date) > new Date()) {
          // do not show unreleased articles
          prevDoc = null;
        }
      }
      if (result[1].length > 1) {
        nextDoc = result[1][1];
      }

      // create realted stage
      var relatedStage = { groups: [] };

      if (doc.classification.relatedTag) {
        var tag = doc.classification.relatedTag;
        relatedStage.groups.push(Layout.createGroup('tag', 'spaced', {
          numTeasers: 3, tag: tag, seperate: false,
          title: 'Mehr zum Thema ' + tag.name.toUpperCase()
        }));
      }

      relatedStage.groups.push(Layout.createGroup('category', 'spaced', {
        numTeasers: 3, category: cls, seperate: false,
        title: 'Mehr aus ' + cls.title.toUpperCase()
      }));

      doc.classification.collections.forEach(function(c) {
        relatedStage.groups.push(Layout.createGroup('collection', 'spaced', {
          numTeasers: 3, collection: c, seperate: false,
          title: 'Weitere ' + c.title.toUpperCase()
        }));
      });

      var usedIds = {};
      usedIds[doc._id] = true;

      return Layout.build(app, classes, relatedStage, doc.date, usedIds);

    }).then(function(relatedLayout) {

      app.replyView(request, reply, 'article-page', {
        pageTitle: doc.title + ' - ' + doc.subtitle,
        pageDescription: doc.teaser,
        article: prepareArticle(app, doc),
        prevArticle: prevDoc,
        nextArticle: nextDoc,
        classification: cls,
        classifications: classes,
        relatedLayout: relatedLayout
      });


    }).fail(function(err) {
      reply(err);
    });
  };
};
