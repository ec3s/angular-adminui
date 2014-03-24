(function(ng) {
  'use strict';
  var AdminuiFrame = function() {
    return {
      restrict: 'A',
      templateUrl: 'views/adminui-frame.html',
      transclude: true,
      link: function(scope, elem, attrs) {
        /* dose default show submenu */
        scope.isSubMenuShow = attrs.showSubmenu ?
                              scope.$eval(attrs.showSubmenu) : false;
        /* bind submenu toggle */
        scope.toggleSubMenu = ng.bind(scope, toggleSubMenu);
      }
    };
  };

  var toggleSubMenu = function() {
    this.isSubMenuShow = !this.isSubMenuShow;
  };

  ng.module('ntd.directives').directive('adminuiFrame', [AdminuiFrame]);
})(angular);
