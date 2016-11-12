(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Wireframes',
    type: 'Wireframe',
    path: '/wireframes'
  };


  module.controller('WireframesCtrl', function(
    $scope,
    $location,
    crResources,
    crPagination
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.newDisabled = true;
    $scope.list = {
      columns: [{ path: 'slug'}],
      paginator: crPagination.createViewPaginator(crResources.get(config.type), 'all')
    };
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('WireframeCtrl', function(
    $scope,
    $location,
    $routeParams,
    crResources,
    crTagCompletion
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.modelOptions = {
      disableDelete: true
    };
    $scope.id = $routeParams.id;
    $scope.$on('cr:model:saved', function(e, doc) {
      $location.path(config.path + '/' + doc._id);
    });

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
  });

})();
