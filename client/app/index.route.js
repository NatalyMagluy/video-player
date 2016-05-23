var mainTemplate = require('./main/main.html');

module.exports = function routerConfig($stateProvider, $urlRouterProvider) {
  'use strict';
  $stateProvider
      .state('home', {
        url: '/',
        template: mainTemplate,
        controller: 'MainController',
        controllerAs: 'main'
      });

  $urlRouterProvider.otherwise('/');
};
