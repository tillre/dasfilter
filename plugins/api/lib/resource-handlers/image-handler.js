var Q = require('kew');
var Path = require('path');
var Statics = require('../statics.js');
var Helpers = require('./helpers.js');


var sizeX = { w: 1600, h: 900, name: 'x' };
var sizeL = { w: 1280, h: 720, name: 'l' };
var sizeM = { w: 720, h: 405, name: 'm' };
var sizeS = { w: 480, h: 270, name: 's' };


// sizes for each image family
var imageSizes = {
  teaser: [
    { name: 'original' },
    { name: sizeX.name, width: sizeX.w, height: sizeX.h, option: '^', crop: true, suffix: '-' + sizeX.name },
    { name: sizeL.name, width: sizeL.w, height: sizeL.h, option: '^', crop: true, suffix: '-' + sizeL.name },
    { name: sizeM.name, width: sizeM.w, height: sizeM.h, option: '^', crop: true, suffix: '-' + sizeM.name },
    { name: sizeS.name, width: sizeS.w, height: sizeS.h, option: '^', crop: true, suffix: '-' + sizeS.name }
  ],
  article: [
    { name: 'original' },
    { name: sizeX.name, width: sizeX.w, suffix: '-' + sizeX.name },
    { name: sizeL.name, width: sizeL.w, suffix: '-' + sizeL.name },
    { name: sizeM.name, width: sizeM.w, suffix: '-' + sizeM.name },
    { name: sizeS.name, width: sizeS.w, suffix: '-' + sizeS.name }
  ],
  gallery: [
    { name: 'original'},
    // thumbs
    { name: 't' + sizeX.name, width: 416, height: 234, option: '^', crop: true, suffix: '-t' + sizeX.name },
    { name: 't' + sizeL.name, width: 272, height: 153, option: '^', crop: true, suffix: '-t' + sizeL.name },
    { name: 't' + sizeM.name, width: 160, height: 90, option: '^', crop: true, suffix: '-t' + sizeM.name },
    { name: 't' + sizeS.name, width: 80, height: 45, option: '^', crop: true, suffix: '-t' + sizeS.name },
    // images
    { name: sizeX.name, width: sizeX.w, option: '^', crop: true, suffix: '-' + sizeX.name },
    { name: sizeL.name, width: sizeL.w, option: '^', crop: true, suffix: '-' + sizeL.name },
    { name: sizeM.name, width: sizeM.w, option: '^', crop: true, suffix: '-' + sizeM.name },
    { name: sizeS.name, width: sizeS.w, option: '^', crop: true, suffix: '-' + sizeS.name }
  ]
};


module.exports = function(api, statics) {

  var resources = api.cores.resources;


  function getExt(doc) {
    // convert everything except gifs to jpgs
    var ext = Path.extname(doc.file.name);
    return (ext === '.gif' ? ext : '.jpg');
  }


  function getSizes(doc) {
    var ext = getExt(doc);

    // only resize non gifs
    if (ext !== '.gif') {
      var sizes = imageSizes[doc.family];
      if (!sizes) {
        var err = new Error('No sizes found for image family: ' + doc.family);
        err.code = 400;
        throw err;
      }
      return sizes;
    }
    else {
      return [{ name: 'original' }];
    }
  }


  function handleMultipart(payload) {
    var doc = payload.doc;
    var fileBuffer = payload.file0;
    var sizes = getSizes(doc);

    var ext = getExt(doc);
    var created = doc.stamp_ ? new Date(doc.stamp_.created.date) : new Date();

    return statics.storeImage(fileBuffer, doc.slug, ext, sizes, created).then(function(sizes) {
      doc.file.url = sizes.original;
      doc.file.sizes = sizes;
      return doc;
    });
  }


  //
  // create handler
  //

  api.pre.create('Image', function(payload) {
    var self = this;

    if (!payload.isMultipart) {
      var err = new Error('Payload is not multipart');
      err.code = 400;
      throw err;
    }

    var doc = payload.doc;
    var imageUrl = statics.getImageUrl(new Date(), doc.slug, getExt(doc));

    return Helpers.checkUniqueness(
      resources.Image,
      'by_url',
      'slug',
      imageUrl

    ).then(function() {
      return handleMultipart(payload);
    });
  });


  //
  // update handler
  //

  api.pre.update('Image', function(payload) {

    // if the payload is multipart, the image file will be updated
    // otherwise we only update the document
    // var updateImageMaybe = function() {
    //   if (payload.isMultipart) {
    //     return handleMultipart(payload);
    //   }
    //   else {
    //     return Q.resolve(payload);
    //   }
    // };

    var doc = (payload.isMultipart ? payload.doc : payload);
    var sizes = getSizes(doc);

    return resources.Image.load(doc._id).then(function(oldDoc) {

      if (oldDoc.family !== doc.family) {
        var err = new Error('Family cannot be changed');
        err.errors = [{ message: err.message, path: '/family', code: 409 }];
        err.code = 400;
        throw err;
      }

      // old slug
      if (oldDoc.slug === doc.slug) {
        if (payload.isMultipart) {
          return handleMultipart(payload);
        }
        else {
          return Q.resolve(doc);
        }
      }

      // new slug
      return Helpers.checkUniqueness(
        resources.Image,
        'by_url',
        doc,
        'file.url'

      ).then(function() {
        if (payload.isMultipart) {
          return handleMultipart(payload);
        }
        else {
          return statics.renameImage(oldDoc, doc, sizes).then(function() {
            return doc;
          });
        }
      });
      // return Helpers.checkUniqueness(
      //   resources.Image,
      //   'by_url',
      //   doc,
      //   'file.url'

      // ).then(function() {
      //   console.log('oldDoc', oldDoc);
      //   return statics.renameImage(
      //     oldDoc,
      //     doc,
      //     sizes
      //   );

      // }).then(function() {
      //   return updateImageMaybe();
      // });
    });
  });
};
