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

  console.log('app config', appConfig);
  console.log('user config', userConfig);

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
      title: 'Home',
      path: '/home',
      isActive: true
    },
    {
      title: 'Articles',
      children: [
        {
          title: 'Drafts',
          path: '/articles/drafts'
        },
        {
          title: 'Published',
          path: '/articles/published'
        }
      ]
    },
    {
      title: 'Galleries',
      path: '/galleries'
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
      title: 'Tags',
      path: '/tags'
    },
    {
      title: 'Contributors',
      path: '/contributors'
    },
    {
      title: 'Stages',
      path: '/stages'
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
      { path: '/home', template: '/home', controller: 'HomeCtrl' },

      { path: '/articles', redirectTo: '/articles/:published' },
      { path: '/articles/published', template: '/resource-list', controller: 'ArticlesCtrl' },
      { path: '/articles/drafts', template: '/resource-list', controller: 'ArticlesCtrl' },
      { path: '/articles/new', template: '/resource', controller: 'ArticleCtrl' },
      { path: '/articles/:id', template: '/resource', controller: 'ArticleCtrl' },

      { path: '/stages', template: '/stages-list', controller: 'StagesCtrl' },
      { path: '/stages/:type/:id', template: '/resource', controller: 'StageCtrl' }
    ]
          .concat(createRoutes('/users', 'UsersCtrl', 'UserCtrl'))
          .concat(createRoutes('/pages', 'PagesCtrl', 'PageCtrl'))
          .concat(createRoutes('/contributors', 'ContributorsCtrl', 'ContributorCtrl'))
          .concat(createRoutes('/categories', 'CategoriesCtrl', 'CategoryCtrl'))
          .concat(createRoutes('/collections', 'CollectionsCtrl', 'CollectionCtrl'))
          .concat(createRoutes('/tags', 'TagsCtrl', 'TagCtrl'))
          .concat(createRoutes('/galleries', 'GalleriesCtrl', 'GalleryCtrl'))
          .concat(createRoutes('/images', 'ImagesCtrl', 'ImageCtrl'))

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
    $routeProvider.otherwise({ redirectTo: '/home' });

    //
    // api auth
    //
    var authValue = 'Basic ' + btoa(userConfig.username + ':' + appConfig.apiKey);
    $httpProvider.defaults.headers.common.Authorization = authValue;
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
