(function() {

  var module = angular.module('dfAdmin');

  var config = {
    title: 'Users',
    type: 'User',
    path: '/users',
    list: {
      headers: [{ path: 'username' }]
    }
  };

  module.controller('UsersCtrl', function(
    $scope,
    $location
  ) {

    angular.extend($scope, angular.copy(config));
    $scope.$on('cr:list:select', function(e, id) {
      e.stopPropagation();
      $location.path(config.path + '/' + id);
    });
  });


  module.controller('UserCtrl', function(
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
