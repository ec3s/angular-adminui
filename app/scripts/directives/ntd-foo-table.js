/* foo table */
(function() {
  'use strict';
  function fooTableDirective() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $(element).addClass('footable').footable();
      }
    };
  }
  
  angular.module('ntd.directives').directive('fooTable', [fooTableDirective]);
}());
