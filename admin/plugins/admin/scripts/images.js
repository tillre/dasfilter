(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Images',
    type: 'Image',
    path: '/images'
  };


  module.controller('ImagesCtrl', function(
    $scope,
    $location,
    crResources,
    crPagination,
    dfApp
  ) {

    $scope.list = {
      columns: [
        {
          title: 'Image',
          map: function(doc) {
            var size = doc.file.sizes.s ? doc.file.sizes.s : doc.file.url;
            var url = dfApp.paths.images + '/' + size;
            return '<img src="' + url + '" width="80px">';
          }
        },
        { path: 'title' },
        { path: 'family' }
      ],
      paginator: crPagination.createViewPaginator(
        crResources.get(config.type), 'all', { descending: true }
      )
    };

    $scope.showSearch = true;

    angular.extend($scope, angular.copy(config));

    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('ImageCtrl', function(
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
