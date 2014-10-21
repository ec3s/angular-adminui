(function(ng) {
  'use strict';
  var loadBackdrop = function($location, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        scope.$watch(function() {
          return $location.path();
        },function() {
          elem.fadeTo(200, 0.7);
        });
        scope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            elem.finish();
            elem.fadeOut('normal');
          });
        });
      }
    };
  };
  ng.module('ntd.directives')
  .directive('adminuiLoadBackdrop', ['$location', '$timeout', loadBackdrop]);
})(angular);
