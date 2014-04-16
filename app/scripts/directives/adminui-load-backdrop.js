(function(ng) {
  'use strict';
  var loadBackdrop = function($location) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        scope.$on('$routeChangeStart', function() {
          // only show load backdrop when path changed
          scope.$watch(function() {
            return $location.path();
          }, function(value, oldValue) {
            if (value !== oldValue) {
              elem.fadeTo(200, 0.7);
            }
          });
        });
        scope.$on('$routeChangeSuccess', function() {
          elem.finish();
          elem.fadeOut('normal');
        });
      }
    };
  };
  ng.module('ntd.directives')
  .directive('adminuiLoadBackdrop', ['$location', loadBackdrop]);
})(angular);
