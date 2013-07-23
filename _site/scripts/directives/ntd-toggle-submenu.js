'use strict';
/* toggle submenu */
angular.module('ntd.directives').directive('toggleSubmenu', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        function toggle() {
            $('#J_subMenu').parent().toggle();
            $('#J_mainContent').toggleClass('span10');
        }

        element.bind('click', function() {
            $(this).bind('selectstart', function() { return false; });
            $(this).parent().toggleClass('active');
            toggle();
        });
      }
    };
  }
]);
