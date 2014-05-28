var Path = require('path');
var Q = require('kew');
var Gm = require('gm');
var File = require('./file.js');


function getDatePath(date) {
  return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}


function getImageFilename(slug, ext, size) {
  size = size || {};
  var suffix = size.suffix || '';
  if (!suffix) {
    if (size.width && size.height) suffix = size.width + 'x' + size.height;
    else if (size.width)           suffix = size.width;
    else if (size.height)          suffix = size.height;
  }
  return slug + suffix + ext;
}


function getImageUrl(date, slug, ext, size) {
  return getDatePath(date) + '/' + getImageFilename(slug, ext, size);
}


//
// storeResizedImage
// sizes: E.g.
//   {}
//   { width: 40 },
//   { width: 16, height: 16 },
//   { width: 16, height: 16, option: '!'},
//   { width: 32, height: 32, option: '^'},
//   { width: 32, height: 32, option: '^', crop: true},
//   { width: 32, height: 32, option: '^', crop: true, gravity: "NorthWest"}
//
function storeResizedImage(buffer, destFile, options) {
  var width = options.width || null;
  var height = options.height || null;

  // One of %, @, !, ^, < or > see the GraphicsMagick docs for details
  var extraOption = options.option;

  var defer = Q.defer();
  var op = Gm(buffer);

  if (options.crop && width && height) {
    // crop to specified width height - uses gravity option as well as
    // x and y to decide what area to keep. Default is center of image
    op.resize(width, height, extraOption)
      .gravity(options.gravity || 'Center')
      .crop(width, height, options.x, options.y);
  }
  else if (width || height) {
    op.resize(width, height, extraOption);
  }
  op.write(destFile, function(err) {
    if (!err) {
      defer.resolve(destFile);
    }
    else {
      defer.reject(err);
    }
  });
  return defer.promise;
}



module.exports = function(imagesDir) {

  function storeImage(buffer, slug, ext, sizes, date) {
    // store original if no sizes specified or extension is .gif
    sizes = sizes || [{}];

    var datePath = getDatePath(date);

    // create images dir
    return File.mkdirRec(Path.join(imagesDir, datePath)).then(function() {

      // resize and save image in all possible sizes
      var promises = sizes.map(function(size) {
        var url = getImageUrl(date, slug, ext, size);
        var path = Path.join(imagesDir, url);

        return storeResizedImage(buffer, path, size).then(function() {
            return { name: size.name, url: url };
          });
      });
      return Q.all(promises);

    }).then(function(images) {
      // create sizes url map
      var sizes = {};
      images.forEach(function(img) {
        sizes[img.name || 'original'] = img.url;
      });
      return sizes;
    });
  }


  function renameImage(oldslug, newslug, ext, sizes, date) {
    // if no sizes specified then original was stored
    sizes = sizes || [{}];

    return Q.all(sizes.map(function(size) {

      var oldUrl = getImageUrl(date, oldslug, ext, size);
      var oldFile = Path.join(imagesDir, oldUrl);

      var newUrl = getImageUrl(date, newslug, ext, size);
      var newFile = Path.join(imagesDir, newUrl);

      return File.rename(oldFile, newFile).then(function (filepath) {
        return newUrl;
      });
    }));
  }


  return {
    storeImage: storeImage,
    renameImage: renameImage,

    getImageUrl: getImageUrl
  };
};
