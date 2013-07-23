'use strict';

angular.module('ntd.directives').directive('fooTable', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $(element).addClass('footable').footable();
    }
  };
}]);
