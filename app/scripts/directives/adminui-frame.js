(function(ng) {
  'use strict';
  var AdminuiFrame = function(
    adminuiFrameProvider, $rootScope, $location,
    $timeout, $modal, $http, $route, $parse, $compile, SYS, flash) {
    return {
      restrict: 'A',
      templateUrl: 'templates/adminui-frame.html',
      transclude: true,
      scope: {
        userInfo: '=',
        messages: '='
      },
      compile: function(element, attributes) {
        var plugin = attributes['plugin'] ?
          $parse(attributes['plugin'])($rootScope) : {};
        var pluginContainer = $('<li>').addClass('nav-plugin');
        if (plugin.hasOwnProperty('template')) {
          var pluginEl = $(plugin.template);
          if (pluginEl.length != 0) {
            pluginContainer.append(pluginEl);
            element.find('.nav ul.sub-navbar').append(
              $compile(pluginContainer)($rootScope)
            );
          }
        }
        return (linkFn(adminuiFrameProvider, $rootScope, $location,
        $timeout, $modal, $http, $route, $parse, SYS, flash));
      }
    };
  };

  var linkFn = function(
    adminuiFrameProvider, $rootScope, $location,
    $timeout, $modal, $http, $route, $parse,
    SYS, flash) {
    return function(scope, elem, attrs) {
      /* dose default show submenu */
      scope.isSubMenuShow = adminuiFrameProvider.defaultShowSubmenu;
      /* has side menu in selected nav */
      scope.hasSideMenu = false;
      /* 所有菜单都没有侧边菜单子集 */
      scope.noSideMenu = true;
      /* has sub navigation bar */
      scope.hasSubNav = false;
      /* dose show message box */
      scope.isMessageBoxShow = adminuiFrameProvider.showMessageBox;
      /* bind navigation data */
      scope.navigation = adminuiFrameProvider.navigation;
      /* init messages */
      scope.messages = scope.messages ? scope.messages : [];

      /* init common menus */
      scope.commonMenus = [];
      /* init account system host */
      scope.accountHost = null;
      /* does navigation inited */
      scope.isInited = false;

      scope.userInfo = ng.extend({
        'username': null,
        'accessToken': null,
        'avatar': 'images/avatar.jpg',
        'logout': function() { console.log('logout'); },
        'changePwd': function() { console.log('change password'); }
      }, scope.userInfo);

      /* watch if has sub navigation, add body's padding top */
      scope.$watch('hasSubNav', function(value, oldValue) {
        if (value == true) {
          $('body').addClass('padding-submenu');
        }
      });

      scope.$watch('userInfo', function(value) {
        if (scope.isInited && value.accessToken !== null) {
          fetchCommonMenus($http, scope);
        }
      }, true);

      /* init navigation from systems */
      initNav(
        scope, $http, $route, SYS,
        adminuiFrameProvider.navigation, $location.path()
      );

      /* when route changed, reselected */
      $rootScope.$on('$routeChangeStart', function() {
        if (scope.isInited) {
          selectPath(scope, $location.path());
        }
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        if (scope.isInited) {
          parseNavUrl(scope.navigation, $route);
        }
      });

      $rootScope.$on('$routeChangeError', function() {
        selectPath(scope, '/_default_');
      });

      $rootScope.$on('selectPath', function(evt, path) {
        selectPath(scope, path);
      });

      /* bind menu select func */
      scope.select = ng.bind(scope, select, $timeout, elem);
      /* bind submenu toggle */
      scope.toggleSubMenu = ng.bind(scope, toggleSubMenu);
      /* bind select nav */
      scope.selectNav = ng.bind(scope, selectNav);
      /* bind select menu*/
      scope.selectMenu = ng.bind(scope, selectMenu);
      /* bind is current selected */
      scope.isSelected = ng.bind(scope, isSelected);
      /* bind set side menu */
      scope.setSideMenu = ng.bind(scope, setSideMenu, elem);
      /* bind logout func */
      scope.logout = ng.bind(scope, logout);
      /* bind change password func */
      scope.changePwd = ng.bind(scope, changePwd);
      /* bind add common menu func */
      scope.addCommonMenu = ng.bind(
        scope, addCommonMenu, $http, $location, $modal, flash
      );

    };
  };

  var initNav = function(scope, $http, $route, SYS, navigation, currentPath) {

    navigation.children.push({
      'name': 'default',
      'show': false,
      'url': '/_default_',
      'children': null
    });

    $http.jsonp(
      SYS.host + '/api/systems?callback=JSON_CALLBACK'
    ).then(function(res) {
      var systemMatched = false;
      ng.forEach(res.data, function(nav) {
        if (nav.code == navigation.code) {
          systemMatched = true;
          nav.children = ng.copy(navigation.children);
          nav.show = navigation.hasOwnProperty('show') ?
            navigation.show : true;
        } else {
          nav.children = null;
        }

        if (nav.code == 'account') {
          scope.accountHost = nav.url;
          scope.userInfo.changePwd = function() {
            location.href = scope.accountHost + '/#/password';
          };
        }
      });

      if (systemMatched == false) {
        res.data.push(ng.copy(navigation));
      }

      scope.navigation = res.data;
      /* prepare navigation data */
      init(scope, scope.navigation, $route);
      scope.isInited = true;
      /* select from path */
      selectPath(scope, currentPath);
      /* fetch common menu */
      fetchCommonMenus($http, scope);
    }, function(res) {
      scope.navigation = [navigation];
      /* prepare navigation data */
      init(scope, scope.navigation, $route);
      scope.isInited = true;
      /* select from path */
      selectPath(scope, currentPath);
      /* fetch common menu */
      fetchCommonMenus($http, scope);
    });

  };


  var hasSameMenu = function($scope, url) {
    var hasSameMenu = false;
    ng.forEach($scope.commonMenus, function(menu) {
      if ($.trim(menu.link) == $.trim(url)) {
        hasSameMenu = true;
      }
    });
    return hasSameMenu;
  };

  var addCommonMenu = function($http, $location, $modal, flash) {
    if (this.commonMenus.length >= 10) {
      flash.notify({
        state: 'error',
        info: '您设置的常用菜单已经达到10个，请点击 <a href="' +
          this.accountHost + '/#/menus">这里</a> 清除不经常使用的菜单。'
      });
      return;
    }

    if (hasSameMenu(this, $location.absUrl())) {
      flash.notify({
        state: 'error',
        info: '常用菜单中已存在此链接'
      });
      return;
    }

    var dialog = $modal.open({
      controller: 'CommonMenuDialogCtrl',
      templateUrl: 'templates/common-menu-dialog.html',
      resolve: {
        name: function() {
          var titleEl = ng.element('body').find('.page-header>h1');
          if (titleEl.length > 0) {
            return titleEl.text();
          }
          return '';
        },
        url: function() {
          return $location.absUrl();
        }
      }
    });

    dialog.result.then(function(data) {
      if (this.accountHost === null) {
        return;
      }
      if ($.trim(data.name) == '') {
        flash.notify({
          state: 'error',
          info: '常用菜单名称不能为空'
        });
        return;
      }
      data.access_token = this.userInfo.accessToken;
      $http.jsonp(
        this.accountHost + '/api/menus/create?callback=JSON_CALLBACK',
        {
          params: data
        }
      ).then(function(res) {
        flash.notify({
          state: 'success',
          info: '常用菜单 ' + data.name + ' 添加成功'
        });
        this.commonMenus = res.data;
      }.bind(this), function(res) {
        flash.notify({
          state: 'error',
          info: '常用菜单添加失败，请联系管理员'
        });
      });
    }.bind(this));
  };

  var fetchCommonMenus = function($http, scope) {
    if (scope.accountHost === null || scope.userInfo.accessToken === null) {
      return;
    }
    $http.jsonp(
      scope.accountHost + '/api/menus/jsonp?callback=JSON_CALLBACK',
      {
        params: {
          'access_token': scope.userInfo.accessToken
        }
      }
    ).then(function(res) {
      scope.commonMenus = res.data;
    });
  };

  var logout = function(evt) {
    evt.preventDefault();
    this.userInfo.logout();
  };

  var changePwd = function(evt) {
    evt.preventDefault();
    this.userInfo.changePwd();
  };

  var parseParams = function(url, params, route) {
    var searchInfo = {};
    var parsedUrl = '';
    var queryInfo = [];
    ng.forEach(params, function(value, key) {
      var paramKey = value.replace('@', '');
      if (route.hasOwnProperty(paramKey)) {
        searchInfo[key] = route[paramKey];
      }
    });
    var schema = '';
    if (ng.isString(url)) {
      if (url.match(/^\w*:\/\//) !== null) {
        schema = url.match(/^\w*:\/\//)[0];
        url = url.replace(schema, '');
      }
      var result = [];
      ng.forEach(url.split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          if (searchInfo.hasOwnProperty(key)) {
            result.push(segment.replace(key, searchInfo[key]));
            delete searchInfo[key];
          }
        }
      });
      parsedUrl = result.join('');
    }
    ng.forEach(searchInfo, function(value, key) {
      queryInfo.push(key + '=' + decodeURIComponent(value));
    });
    if (queryInfo.length > 0) {
      parsedUrl += '?' + queryInfo.join('&');
    }
    return schema + parsedUrl;
  };

  var init = function(scope, parentNavs, $route) {
    var navigation = arguments[3] === undefined ? null : arguments[3];
    var level = arguments[4] === undefined ? 0 : arguments[4];
    ng.forEach(parentNavs, function(nav) {
      nav.urlTemplate = nav.url;
      nav.url = parseParams(nav.url, nav.params, $route.current.params);
      nav.parentNav = navigation;
      nav.level = level + 1;
      nav.show = nav.hasOwnProperty('show') ? nav.show : true;
      /* show sub navigation when has sub menu */
      if (nav.level == 2 && nav.show == true) {
        scope.hasSubNav = true;
      }
      if (nav.children != null) {
        init(scope, nav.children, $route, nav, nav.level);
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
    return generateMatch(endChildren);
  };

  var generateMatch = function(endChildren) {
    ng.forEach(endChildren, function(child) {
      if (ng.isUndefined(child.match) && child.url != null) {
        child.match = child.url.replace('#', '');
      }
    });
    return endChildren;
  };

  var selectPath = function(scope, path) {
    clearSelected(scope.navigation);
    var endChildren = getEndChildren(scope.navigation);
    for (var i = 0; i < endChildren.length; i++) {
      var regexp = new RegExp('^' + endChildren[i].match + '$', ['i']);
      if (regexp.test(path)) {
        scope.select(endChildren[i]);
      }
      if (endChildren[i].level > 2 && scope.noSideMenu) {
        scope.noSideMenu = false;
      }
    }
  };

  var select = function($timeout, elem, nav) {
    nav.selected = true;
    if (nav.level == 2) {
      this.setSideMenu(nav.children, nav.name);
    } else if (nav.level == 4) {
      $timeout(function() {
        var collapse = elem.find(
          '.side-nav-menu'
        ).find('.active>.has-sub-menu').parent('li').find('ul');
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

  var setSideMenu = function(elem, menu, name) {
    if (menu == null || menu.length == 0) {
      this.hasSideMenu = false;
    } else {
      this.hasSideMenu = true;
      this.sideMenuName = name;
      this.menu = menu;
    }
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

  var parseNavUrl = function(navigation, $route) {
    ng.forEach(navigation, function(nav) {
      nav.url = parseParams(nav.urlTemplate, nav.params, $route.current.params);
      if (nav.children !== null) {
        parseNavUrl(nav.children, $route);
      }
    });
  };

  var selectNav = function(nav, evt) {
    if (evt.metaKey || evt.ctrlKey || evt.button) {
      return false;
    }
    clearSelected(this.navigation);
    if (nav.url != null) {
      selectPath(this, nav.url.replace('#', ''));
    } else {
      this.select(nav);
    }
    this.setSideMenu(nav.children, nav.name);
  };


  var selectMenu = function(menu, evt) {
    if (evt.metaKey || evt.ctrlKey || evt.button) {
      return false;
    }
    if (menu.children != null) {
      ng.element(evt.currentTarget).parent('li').find('ul').toggle();
    } else {
      clearSelected(this.menu);
      if (menu.url != null) {
        selectPath(this, menu.url.replace('#', ''));
      } else {
        this.select(menu);
      }
    }
  };

  var AdminuiFrameProvider = function() {
    this.config = {
      usedModules: [],
      defaultShowSubmenu: false,
      showMessageBox: false
    };

    this.$get = function() {
      return this.config;
    };

    this.setConfig = function(config) {
      this.config = ng.extend(this.config, config);
      ng.forEach(this.config.usedModules, function(module) {
        module.config(["$httpProvider", adminuiHttpInterceptor]);
      });
    };
  };


  var CommonMenuDialogCtrl = function($scope, $modalInstance, url, name) {
    $scope.menu = {
      'link': url,
      'name': name
    };
    $scope.cancel = ng.bind(this, this.cancel, $modalInstance);
    $scope.add = ng.bind(this, this.add, $scope, $modalInstance);
  };

  CommonMenuDialogCtrl.prototype.add = function($scope, $modalInstance, evt) {
    var eventWithEnter = evt.type == 'keypress' && evt.charCode == 13;
    if (eventWithEnter || evt.type == 'click') {
      $modalInstance.close($scope.menu);
    }
  };

  CommonMenuDialogCtrl.prototype.cancel = function($modalInstance, evt) {
    evt.preventDefault();
    $modalInstance.dismiss('cancel');
  };

  ng.module('ntd.directives').provider(
    'adminuiFrame', [AdminuiFrameProvider]
  );
  ng.module('ntd.directives').directive(
    'adminuiFrame',
    ['adminuiFrame', '$rootScope', '$location',
      '$timeout', '$modal', '$http', '$route', '$parse', '$compile',
      'SYS', 'flash', AdminuiFrame]
  );
  ng.module('ntd.directives').controller(
    'CommonMenuDialogCtrl',
    ['$scope', '$modalInstance', 'url', 'name', CommonMenuDialogCtrl]
  );

  var adminuiHttpInterceptor = function($httpProvider) {
    $httpProvider.interceptors.push(function() {
      return {
        request: function(config) {
          if (config.method == 'GET' && !config.hasOwnProperty('cache')) {
            if (!config.hasOwnProperty('params')) {
              config.params = {};
            }
            var date = new Date();
            config.params['_hash_'] = date.getTime().toString();
          }
          return config;
        }
      };
    });
  };

})(angular);
