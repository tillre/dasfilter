(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Categories',
    type: 'Category',
    path: '/categories',
    list: {
      headers: [
        { path: 'title' },
        { path: 'slug' }
      ],
      options: {
        buttons: [{ event: 'show:category', icon: 'eye-open' }]
      }
    }
  };


  module.controller('CategoriesCtrl', function(
    $scope,
    $location
  ) {

    $scope.$on('show:category', function(e, id) {
      e.stopPropagation();
      dfMagazine.showCategory(id);
    });

    angular.extend($scope, angular.copy(config));
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('CategoryCtrl', function(
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
