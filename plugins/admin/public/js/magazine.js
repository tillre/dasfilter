(function() {

  var module = angular.module('dfAdmin');


  module.service('dfMagazine', function(crResources, dfApp) {

    return {
      showCategory: function(id) {
        var win = window.open('', '_blank');
        crResources.get('Category').load(id).then(function(doc) {
          win.location.href = dfApp.paths.web + '/' + doc.slug;
          win.focus();
        });
      },


      showCollection: function(id) {
        var win = window.open('', '_blank');
        crResources.get('Collection').load(id).then(function(doc) {
          win.location.href = dfApp.paths.web + '/' + doc.slug;
          win.focus();
        });
      },


      previewArticle: function(id) {
        var win = window.open(dfApp.paths.web + '/preview/' + id, '_blank');
        win.focus();
      },


      showArticle: function(id) {
        var win = window.open('', '_blank');
        crResources.get('Article').load(id, { include_refs: true }).then(function(doc) {
          win.location.href = dfApp.paths.web + '/' +
            doc.classification.category.slug + '/' + doc.slug;
          win.focus();
        });
      }
    };
  });
})();