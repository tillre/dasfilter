/*global angular*/

'use strict';


(function() {

  // create module here
  var module = angular.module('dfAdmin', ['ng', 'ngRoute', 'cores']);

  // data provided by BE
  var appConfig = window.DFA.app;
  var userConfig = window.DFA.user;
  module.value('dfApp', appConfig);
  module.value('dfUser', userConfig);

  // generic resolve to always init resources on route change
  var resourcesInitialized = false;
  var resolve = {
    main: function(crResources, dfApp) {
      if (resourcesInitialized) return null;
      return crResources.init({ url: dfApp.apiUrl }).then(function(resources) {
        resourcesInitialized = true;
      });
    }
  };

  // pages config values
  module.value('dfPages', [
    {
      title: 'Published',
      path: '/articles/published'
    },
    {
      title: 'Drafts',
      path: '/articles/drafts'
    },
    {
      title: 'Images',
      path: '/images'
    },
    {
      title: 'Categories',
      path: '/categories'
    },
    {
      title: 'Collections',
      path: '/collections'
    },
    {
      title: 'Contributors',
      path: '/contributors'
    },
    {
      title: 'Wireframes',
      path: '/wireframes'
    },
    {
      title: 'Pages',
      path: '/pages'
    },
    {
      title: 'Users',
      path: '/users'
    }
  ]);


  // init app
  module.config(function($routeProvider, $locationProvider, $httpProvider, dfAppProvider) {

    var dfApp = dfAppProvider.$get();

    //
    // routes
    //
    function createRoutes(path, listCtrl, resCtrl, options) {
      options = options || {};
      return [
        { path: path,
          template: (options.listTemplate || '/resource-list'),
          controller: listCtrl },
        { path: path + '/new',
          template: (options.singleTemplate || '/resource'),
          controller: resCtrl },
        { path: path + '/:id',
          template: (options.singleTemplate || '/resource'),
          controller: resCtrl }
      ];
    }

    var routes = [
      { path: '/articles', redirectTo: '/articles/published' },
      { path: '/articles/published', template: '/resource-list', controller: 'ArticlesCtrl' },
      { path: '/articles/drafts', template: '/resource-list', controller: 'ArticlesCtrl' },
      { path: '/articles/new', template: '/resource', controller: 'ArticleCtrl' },
      { path: '/articles/:id', template: '/resource', controller: 'ArticleCtrl' }
    ]
          .concat(createRoutes('/users', 'UsersCtrl', 'UserCtrl'))
          .concat(createRoutes('/pages', 'PagesCtrl', 'PageCtrl'))
          .concat(createRoutes('/contributors', 'ContributorsCtrl', 'ContributorCtrl'))
          .concat(createRoutes('/categories', 'CategoriesCtrl', 'CategoryCtrl'))
          .concat(createRoutes('/collections', 'CollectionsCtrl', 'CollectionCtrl'))
          .concat(createRoutes('/tags', 'TagsCtrl', 'TagCtrl'))
          .concat(createRoutes('/galleries', 'GalleriesCtrl', 'GalleryCtrl'))
          .concat(createRoutes('/images', 'ImagesCtrl', 'ImageCtrl'))
          .concat(createRoutes('/wireframes', 'WireframesCtrl', 'WireframeCtrl'))

      .map(function(route) {
        if (route.template) {
          route.template = dfApp.paths.templates + route.template;
        }
        return route;
      });

    routes.forEach(function(route) {
      $routeProvider.when(route.path, {
        templateUrl: route.template, controller: route.controller, resolve: resolve
      });
    });
    $routeProvider.otherwise({ redirectTo: '/articles/published' });

    var authValue = 'Basic ' + btoa(appConfig.appKey + ':' + appConfig.appSecret);
    var credValue = userConfig.username + ':' + userConfig.role;
    $httpProvider.defaults.headers.common.Authorization = authValue;
    $httpProvider.defaults.headers.common['df-user'] = credValue;
  });


  module.controller('AppCtrl', function(
    $rootScope,
    $location,
    dfPages
  ) {

    $rootScope.pages = dfPages;

    // set active status on page change
    $rootScope.$on('$routeChangeSuccess', function(e, next, current) {

      var path = $location.path();
      dfPages.forEach(function(page) {
        page.isActive = (new RegExp('^' + page.path)).test(path);
      });
    });
  });

})();
