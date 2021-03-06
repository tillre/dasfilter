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
    crPagination,
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
      paginator: crPagination.createViewPaginator(
        crResources.get(config.type),
        'by_state_date',
        {
          descending: true,
          startkey: [viewType, {}],
          endkey: [viewType],
          include_refs: true
        }
      )
    };

    $scope.showSearch = true;

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
    crResources,
    crTagCompletion,
    dfMagazine
  ) {

    // update tags completion
    crResources.get('Article').view('by_tag', { group: true }).then(
      function success(tags) {
        tags.rows.forEach(function(tag) {
          crTagCompletion.addItem(tag.value, tag.key);
        });
      },
      function error(err) {
        console.log(err);
      }
    );

    angular.extend($scope, angular.copy(config));

    var changed = false;

    $scope.id = $routeParams.id;
    $scope.modelOptions = {
      buttons: [
        { title: 'View', event: 'article:view' }
      ]
    };

    $scope.$on('cr:model:saved', function(e, doc) {
      changed = false;
      $location.path(config.path + '/' + doc._id);
    });

    $scope.$on('article:preview', function(e, doc) {
      dfMagazine.previewArticle(doc._id);
    });

    $scope.$on('article:view', function(e, doc) {
      dfMagazine.showArticle(doc._id);
    });

    $scope.$on('cr:model:destroy', function(e) {
      changed = false;
      $location.path('/');
    });

    $scope.$on('cr:model:change', function(e, path) {
      changed = true;
    });

    $scope.$on('$locationChangeStart', function(e) {
      if (!changed) {
        return;
      }
      var answer = window.confirm('Discard changes?');
      if (!answer) {
        e.preventDefault();
      }
    });

    window.onbeforeunload = function (evt) {
      if (!changed) {
        return;
      }
      return 'Discard changes?';
    };
  });

})();
