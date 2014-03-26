(function(ng) {
  'use strict';
  var AdminuiFrame = function(adminuiFrameProvider, $location, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'templates/adminui-frame.html',
      transclude: true,
      link: function(scope, elem, attrs) {
        /* dose default show submenu */
        scope.isSubMenuShow = adminuiFrameProvider.defaultShowSubmenu;
        /* dose show message box */
        scope.isMessageBoxShow = adminuiFrameProvider.showMessageBox;
        /* bind navigation data */
        scope.navigation = adminuiFrameProvider.navigation;

        /* perpare navigation data */
        init(scope.navigation);

        /* bind menu select func */
        scope.select = ng.bind(scope, select, $timeout);
        /* bind submenu toggle */
        scope.toggleSubMenu = ng.bind(scope, toggleSubMenu);
        /* bind select nav */
        scope.selectNav = ng.bind(scope, selectNav);
        /* bind select menu*/
        scope.selectMenu = ng.bind(scope, selectMenu);
        /* bind is current selected */
        scope.isSelected = ng.bind(scope, isSelected);

        /* select from path */
        selectPath(scope, $location.path());
      }
    };
  };

  var init = function(navigation) {
    var parentNav = arguments[1] === undefined ? null : arguments[1];
    var level = arguments[2] === undefined ? 0 : arguments[2];
    ng.forEach(navigation, function(nav) {
      nav.parentNav = parentNav;
      nav.level = level + 1;
      if (nav.children != null) {
        init(nav.children, nav, nav.level);
      }
    });
  };

  var getEndChildren = function(navigation) {
    var endChildren = arguments[1] ? arguments[1] : [];
    ng.forEach(navigation, function(nav) {
      if (nav.children == null) {
        endChildren.push(nav);
      } else {
        getEndChildren(nav.children, endChildren);
      }
    });
    return endChildren;
  };

  var selectPath = function(scope, path) {
    clearSelected(scope.navigation);
    var endChildren = getEndChildren(scope.navigation);
    for (var i = 0; i < endChildren.length; i++) {
      var url = endChildren[i].url.replace('#', '');
      if (path == url) {
        scope.select(endChildren[i]);
        break;
      }
    }
  };

  var select = function($timeout, nav) {
    nav.selected = true;
    if (nav.level == 2) {
      this.sideMenuName = nav.name;
      setSideMenu.bind(this)(nav.children);
    } else if (nav.level == 4) {
      $timeout(function() {
        var collapse = ng.element('.side-nav-menu')
          .find('.active>.has-sub-menu').parent('li').find('ul');
          collapse.show();
      });
    }

    if (nav.parentNav != null) {
      this.select(nav.parentNav);
    }
  };

  var isSelected = function(item) {
    return item.selected ? true : false;
  };

  var setSideMenu = function(menu) {
    this.menu = menu;
  };

  var toggleSubMenu = function(e) {
    this.isSubMenuShow = !this.isSubMenuShow;
  };

  var clearSelected = function(item) {
    for (var i = 0; i < item.length; i++) {
      item[i].selected = false;
      if (item[i].children != null) {
        clearSelected(item[i].children);
      }
    }
  };

  var selectNav = function(nav) {
    clearSelected(this.navigation);
    this.select(nav);
    setSideMenu.bind(this)(nav.children);
  };


  var selectMenu = function(menu, evt) {
    if (menu.children != null) {
      ng.element(evt.target).parent('li').find('ul').toggle();
    } else {
      clearSelected(this.menu);
      this.select(menu);
    }
  };

  var AdminuiFrameProvider = function() {
    this.config = {
      defaultShowSubmenu: false,
      showMessageBox: false
    };

    this.$get = function() {
      return this.config;
    };

    this.setConfig = function(config) {
      this.config = ng.extend(this.config, config);
    };
  };

  ng.module('ntd.directives').provider(
    'adminuiFrame', [AdminuiFrameProvider]);
  ng.module('ntd.directives').directive(
    'adminuiFrame', ['adminuiFrame', '$location', '$timeout', AdminuiFrame]);
})(angular);
