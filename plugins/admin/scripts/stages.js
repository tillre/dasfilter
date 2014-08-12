(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Stages',
    type: 'ClassificationStage',
    path: '/stages'
  };


  module.controller('StagesCtrl', function(
    $scope,
    $location,
    crResources,
    crPagination
  ) {

    $scope.startList = {
      type: 'StartStage',
      paginator: crPagination.createViewPaginator(
        crResources.get('StartStage'), 'all'
      ),
      columns: [
        { title: 'Start Stage', path: 'title' }
      ]
    };

    $scope.categoriesList = {
      type: 'ClassificationStage',
      paginator: crPagination.createViewPaginator(
        crResources.get('ClassificationStage'), 'categories'
      ),
      columns: [
        { title: 'Category Stages', path: 'title' }
      ]
    };

    $scope.collectionsList = {
      type: 'ClassificationStage',
      paginator: crPagination.createViewPaginator(
        crResources.get('ClassificationStage'), 'collections'
      ),
      columns: [
        { title: 'Collection Stages', path: 'title' }
      ]
    };

    angular.extend($scope, angular.copy(config));

    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + e.targetScope.paginator.resource.type + '/' + id);
    });
  });


  module.controller('StageCtrl', function(
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
    $scope.type = $routeParams.type;
    $scope.id = $routeParams.id;

    if ($scope.type === 'StartStage') {
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
    }
  });

})();
