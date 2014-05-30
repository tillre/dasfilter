(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Stages',
    type: 'ClassificationStage',
    path: '/stages'
  };


  module.controller('StagesCtrl', function(
    $scope,
    $location
  ) {

    $scope.startList = {
      type: 'StartStage',
      view: 'all',
      columns: [
        { title: 'Start Stage', path: 'title' }
      ]
    };
    $scope.categoriesList = {
      type: 'ClassificationStage',
      view: 'categories',
      columns: [
        { title: 'Category Stages', path: 'title' }
      ]
    };
    $scope.collectionsList = {
      type: 'ClassificationStage',
      view: 'collections',
      columns: [
        { title: 'Collection Stages', path: 'title' }
      ]
    };

    angular.extend($scope, angular.copy(config));

    $scope.$on('cr:list:select', function(e, id) {
      console.log('e', e);
      e.stopPropagation();
      $location.path(config.path + '/' + e.targetScope.type + '/' + id);
    });
  });


  module.controller('StageCtrl', function(
    $scope,
    $location,
    $routeParams
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.modelOptions = {
      disableDelete: true
    };
    $scope.type = $routeParams.type;
    $scope.id = $routeParams.id;
  });

})();
