(function(ng) {
  'use strict';
  var AdminuiFrame = function() {
    return {
      restrict: 'A',
      templateUrl: 'views/adminui-frame.html',
      transclude: true,
      link: function(scope, elem, attrs) {
        /* dose default show submenu */
        scope.isSubMenuShow = attrs.defaultShowSubmenu ?
                              scope.$eval(attrs.defaultShowSubmenu) : false;
        /* dose show message box */
        scope.isMessageBoxShow = attrs.showMessageBox ?
                                 scope.$eval(attrs.showMessageBox) : false;
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
