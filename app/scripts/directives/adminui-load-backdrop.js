(function(ng) {
  'use strict';
  var loadBackdrop = function($rootScope, $location, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        scope.$watch(function() {
          return $location.path();
        },function() {
          elem.fadeTo(200, 0.7);
          $rootScope.progressBar = false;
        });
        scope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            elem.finish();
            elem.fadeOut('normal');
            $rootScope.progressBar = true;
          });
        });
      }
    };
  };
  ng.module('ntd.directives')
  .directive('adminuiLoadBackdrop', ['$rootScope',
      '$location', '$timeout', loadBackdrop]);
})(angular);
