(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Collections',
    type: 'Collection',
    path: '/collections'
  };


  module.controller('CollectionsCtrl', function(
    $scope,
    $location,
    crResources,
    crPagination,
    dfMagazine
  ) {

    $scope.$on('show:category', function(e, id) {
      e.stopPropagation();
      dfMagazine.showCollection(id);
    });

    angular.extend($scope, angular.copy(config));
    $scope.list = {
      columns: [{ path: 'title' }, { path: 'slug'}],
      paginator: crPagination.createViewPaginator(crResources.get(config.type), 'all')
    };
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('CollectionCtrl', function(
    $scope,
    $location,
    $routeParams
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.id = $routeParams.id;
    $scope.$on('cr:model:saved', function(e, doc) {
      $location.path(config.path + '/' + doc._id);
    });
    $scope.$on('cr:model:destroy', function(e) {
      $location.path(config.path);
    });
  });

})();
