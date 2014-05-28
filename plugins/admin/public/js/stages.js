(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Stages',
    type: 'ClassificationStage',
    path: '/stages',
    list: {
      headers: [
        { path: 'title' }
      ]
    }
  };


  module.controller('StagesCtrl', function(
    $scope,
    $location
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
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
    $scope.id = $routeParams.id;
  });

})();
