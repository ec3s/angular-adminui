'use strict';
angular.module('ntd.config', []).value('$ntdConfig', {});
var ntdDirective = angular.module('ntd.directives', ['ntd.config', 'ngSanitize',
  'ngAnimate']);
ntdDirective.run(['$rootScope', '$animate',
  function($rootScope, $animate) {
    $rootScope.$on('$routeChangeStart', function() {
      $animate.enabled(false);
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      $animate.enabled(true);
    });
  }]);
