(function() {

  var module = angular.module('dfAdmin');


  function mapDate(doc) {
    var pubDate = moment(doc.date);
    var s = pubDate.format('HH:mm | DD.MM.YYYY');

    var now = moment();
    var today = now.format('YYYYMMDD');

    var color = 'inherit';

    if (pubDate > now) {
      if (pubDate.format('YYYYMMDD') === today) {
        color = 'darkorange';
      }
      else {
        color = 'seagreen';
      }
    }
    else if (pubDate.format('YYYYMMDD') === today) {
      color = 'crimson';
    }
    return '<span style="white-space:nowrap; padding-bottom:2px; border-bottom:2px solid ' + color + '">' + s + '</span>';
  }



  var config = {
    title: 'Articles',
    type: 'Article',
    path: '/articles'
  };


  module.controller('ArticlesCtrl', function(
    $scope,
    $location,
    crResources,
    dfMagazine
  ) {

    // type can be published or draft atm
    var type = $location.path().split('/').pop();
    var viewType = ({
      published: 'published',
      drafts: 'draft'
    })[type];

    $scope.list = {
      columns: [
        {
          title: 'Title',
          map:   function(doc) {
            return '<a href="#/articles/' + doc._id + '">' + doc.title + '<br>' + doc.subtitle + '</a>';
          }
        },
        {
          title: 'Date',
          map: mapDate
        },
        {
          title: 'Category',
          path: 'classification/category/title'
        },
        {
          title: 'User',
          map: function(doc) {
            return doc.stamp_ ? doc.stamp_.modified.user : '';
          }
        }
      ],
      limit: 10,
      view: 'by_state_date',
      params: {
        descending: true,
        startkey: [viewType, {}],
        endkey: [viewType],
        include_refs: true
      }
    };

    $scope.title = 'Articles: ' + type;
    $scope.type = 'Article';
    $scope.path = '/articles';

    // $scope.$on('cr:list:select', function(e, id) {
    //   e.stopPropagation();
    //   $location.path(config.path + '/' + id);
    // });
  });


  module.controller('ArticleCtrl', function(
    $scope,
    $location,
    $routeParams,
    dfMagazine
  ) {

    angular.extend($scope, angular.copy(config));

    $scope.id = $routeParams.id;
    $scope.modelOptions = {
      buttons: [
        { title: 'View', event: 'article:view' }
      ]
    };
    $scope.$on('cr:model:saved', function(e, doc) {
      $location.path(config.path + '/' + doc._id);
    });
    $scope.$on('article:preview', function(e, doc) {
      dfMagazine.previewArticle(doc._id);
    });
    $scope.$on('article:view', function(e, doc) {
      dfMagazine.showArticle(doc._id);
    });
    $scope.$on('cr:model:destroy', function(e) {
      $location.path(config.path);
    });
  });

})();
