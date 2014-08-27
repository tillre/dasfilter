var Path = require('path');
var Fs = require('fs');
var Q = require('kew');
var Gm = require('gm');
var AWS = require('aws-sdk');
var Mime = require('mime');
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





module.exports = function(bucket) {

  var s3 = new AWS.S3();

  function storeFileInCloud(tmpFile, key) {
    var defer = Q.defer();

    Fs.stat(tmpFile, function(err, stats) {
      if (err) {
        return defer.reject(err);
      }
      var rs = Fs.createReadStream(tmpFile);
      s3.putObject({
        Bucket: bucket,
        Key: 'images/' + key,
        Body: rs,
        ContentLength: stats.size,
        ContentType: Mime.lookup(tmpFile)
      }, function(err, data) {
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(key);
      });
    });
    return defer.promise;
  }


  function renameFileInCloud(oldKey, newKey) {
    var defer = Q.defer();

    s3.copyObject({
      Bucket: bucket,
      CopySource: bucket + '/images/' + oldKey,
      Key: 'images/' + newKey

    }, function(err, data) {
      if (err) {
        return defer.reject(err);
      }
      s3.deleteObject({
        Bucket: bucket,
        Key: 'images/' + oldKey

      }, function(err, data) {
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(newKey);
      });
    });
    return defer.promise;
  }

  //
  // storeResizedImage
  // size:
  //   {}
  //   { width: 40 },
  //   { width: 16, height: 16 },
  //   { width: 16, height: 16, option: '!'},
  //   { width: 32, height: 32, option: '^'},
  //   { width: 32, height: 32, option: '^', crop: true},
  //   { width: 32, height: 32, option: '^', crop: true, gravity: "NorthWest"}
  //
  function storeResizedImage(buffer, slug, ext, size, date) {

    var url = getImageUrl(date, slug, ext, size);
    var tmpPath = Path.join('/tmp/images/', getDatePath(date));
    var tmpFile = Path.join('/tmp/images/', url);

    var width = size.width || null;
    var height = size.height || null;

    // One of %, @, !, ^, < or > see the GraphicsMagick docs for details
    var extraOption = size.option;

    // create images dir
    return File.mkdirRec(tmpPath).then(function() {

      var defer = Q.defer();
      var op = Gm(buffer);

      if (size.crop && width && height) {
        // crop to specified width height - uses gravity option as well as
        // x and y to decide what area to keep. Default is center of image
        op.resize(width, height, extraOption)
          .gravity(size.gravity || 'Center')
          .crop(width, height, size.x, size.y);
      }
      else if (width || height) {
        op.resize(width, height, extraOption);
      }
      op.write(tmpFile, function(err) {
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(storeFileInCloud(tmpFile, url));
      });
      return defer.promise;
    });
  }


  function storeImage(buffer, slug, ext, sizes, date) {
    // store original if no sizes specified or extension is .gif
    sizes = sizes || [{}];

    // resize and save image in all possible sizes
    var promises = sizes.map(function(size) {
      return storeResizedImage(buffer, slug, ext, size, date).then(function(url) {
        return { name: size.name, url: url };
      });
    });

    return Q.all(promises).then(function(images) {
      // create sizes url map
      var sizes = {};
      images.forEach(function(img) {
        sizes[img.name || 'original'] = img.url;
      });
      return sizes;
    });
  }


  function renameImage(oldDoc, newDoc, sizes) {
    newDoc.file.sizes = {};

    return Q.all(sizes.map(function(size) {

      var oldUrl = oldDoc.file.sizes[size.name];
      if (!oldUrl) return null;

      var newUrl = Path.join(Path.dirname(oldUrl),
                             getImageFilename(newDoc.slug, Path.extname(oldUrl), size));

      return renameFileInCloud(oldUrl, newUrl).then(function() {
        newDoc.file.sizes[size.name] = newUrl;
      });

    })).then(function() {
      newDoc.file.url = newDoc.file.sizes.original;
    });
  }


  return {
    storeImage: storeImage,
    renameImage: renameImage,

    getImageUrl: getImageUrl
  };
};
