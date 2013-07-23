'use strict';

var demoApp = angular.module('demoApp', ['ntd.services', 'ntd.directives', 'ui.bootstrap', 'bootstrapPrettify']);

demoApp.animation('animate-enter', function() {
  return {
    setup : function(element) {
      //prepare the element for animation
      element.css({ 'opacity': 0 });

    },
    start : function(element) {
      //start the animation
      element.animate({
        'opacity' : 1
      });
    }
  }
});

demoApp
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/base-css', {
        templateUrl: 'views/base_css.html',
        controller: 'MainCtrl'
      })
      .when('/form', {
        templateUrl: 'views/form.html',
        controller: 'MainCtrl'
      })
      .when('/widget', {
        templateUrl: 'views/widget.html',
        controller: 'MainCtrl'
      })
      .when('/bootstrap-ui-widget', {
        templateUrl: 'views/bootstrap_ui_widget.html',
        controller: 'MainCtrl'
      })
      .when('/table', {
        templateUrl: 'views/table.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test2', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test3', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: 'MainCtrl'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      //$locationProvider.html5Mode(true);
  }]);