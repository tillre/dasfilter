var Path = require('path');
var Fs = require('fs');
var Q = require('kew');
var Mkdirp = require('mkdirp');


function copyFile(srcFile, destFile) {
  var defer = Q.defer();

  // Long-winded way of copying a file with nodejs that works when source
  // and destination are on different devices/partitions
  var is = Fs.createReadStream(srcFile);
  var os = Fs.createWriteStream(destFile);

  is.pipe(os);
  is.on('end', function() {
    defer.resolve(destFile);
  });

  is.on('error', function(err) {
    if (err) {
      err.code = 500;
    }
    return defer.reject(err);
  });

  return defer.promise;
}

//
// WARN: when srcFile and destFile basenames only differ
//       in case, both will be unlinked(at least on os x)
function renameFile(srcFile, destFile) {
  var defer = Q.defer();

  var onError = function(err) {
    if (err) {
      err.code = 500;
    }
    return defer.reject(err);
  };

  var is = Fs.createReadStream(srcFile);
  var os = Fs.createWriteStream(destFile);

  is.pipe(os);
  is.on('end', function() {
    Fs.unlink(srcFile, function(err) {
      if (err) {
        onError(err);
      }
      else {
        defer.resolve(destFile);
      }
    });
  });

  is.on('error', onError);

  return defer.promise;
}



//
// mkdir recursive
//
function mkdirRec(absPath) {
  var defer = Q.defer();

  Mkdirp(absPath, function(err) {
    if (err) return defer.reject(err);
    return defer.resolve(absPath);
  });
  return defer.promise;
};



module.exports = {
  copy: copyFile,
  rename: renameFile,
  mkdirRec: mkdirRec
};