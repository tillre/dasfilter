(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Galleries',
    type: 'Gallery',
    path: '/galleries'
  };

  module.controller('GalleriesCtrl', function(
    $scope,
    $location,
    crResources,
    crPagination
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.list = {
      columns: [{ path: 'title' }],
      paginator: crPagination.createViewPaginator(crResources.get(config.type), 'all')
    };
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('GalleryCtrl', function(
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
