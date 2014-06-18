

module.exports = function(urls, request) {

  var helper = {
    start: function() {
      return '/';
    },
    classification: function(cls) {
      return '/' + cls.slug;
    },
    tag: function(tag) {
      return '/tags/' + tag.slug;
    },
    article: function(cls, article) {
      return '/' + cls.slug + '/' + article.slug;
    },
    image: function(image, size) {
      if (!image.file) return '';
      var imgUrl = image.file.url;
      if (image.file) {
        if (image.file.sizes[size]) {
          imgUrl = image.file.sizes[size];
        }
        else if (image.file.sizes.x) {
          imgUrl = image.file.sizes.x;
        }
        return urls.images + '/' + imgUrl;
      }
    },
    asset: function(item) {
      return urls.assets + '/' + item;
    }
  };
  if (request) {
    helper.current = function() {
      return request.path;
    };
    helper.full = function() {
      return urls.magazine + request.path;
    };
    helper.articleFull = function(cls, article) {
      return urls.magazine + '/' + cls.slug + '/' + article.slug;
    };
    helper.classificationFull = function(cls) {
      return urls.magazine + '/' + cls.slug;
    };
    helper.rss = function(cls) {
      return urls.magazine + '/rss' + (cls ? '/' + cls.slug : '');
    };
  }
  return helper;
};