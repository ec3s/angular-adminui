/* toggle submenu */
(function() {
  'use strict';
  function toggle_menuClass() {
      $('#J_subMenu').parent().toggle();
      $('#J_mainContent').toggleClass('span10');
  }

  function toggleSubmenuDirectice(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function() {
            $(this).bind('selectstart', function() { return false; });
            $(this).parent().toggleClass('active');
            toggle_menuClass();
        });
      }
    };
  }
  angular.module('ntd.directives').directive('toggleSubmenu', [toggleSubmenuDirectice]);
}());
