'use strict';

var adminuiApp = angular.module('adminuiApp', [
  'ngRoute',
  'ntd.services',
  'ntd.directives',
  'ui.bootstrap',
  'bootstrapPrettify'
]);

adminuiApp.run(['$rootScope', function($rootScope) {
  $rootScope.userInfo = {
    'username': 'N/A'
  };
}]);
angular.module('ntd.directives').constant('SYS', {
  'host': 'http://sys.systems.dev.me'
});
/* config adminui frame */
angular.module('ntd.directives').config(
  ['adminuiFrameProvider', function(adminuiFrameProvider) {
    adminuiFrameProvider.setConfig({
      defaultShowSubmenu: true,
      showMessageBox: true,
      navigation: {
        'code': 'adminui',
        'name': 'AdminUI',
        'url': null,
        'children': [
          {
          'name': '用户面板',
          'url': '#/',
          'children': [
            {
            'name': '用户面板',
            'url': '#/',
            'children': null
          },
          {
            'name': '子菜单',
            'url': null,
            'children': [
              {
              'name': '分类一',
              'url': '#/sub/test',
              'children': null
            },
            {
              'name': '分类二',
              'url': '#/sub/test2',
              'children': null
            },
            {
              'name': '分类三',
              'url': '#/sub/test3',
              'children': null
            }
            ]
          }
          ]
        },
        {
          'name': '组件样式',
          'url': '#/base-css',
          'children': [
            {
            'name': '基本样式',
            'url': '#/base-css',
            'children': null
          },
          {
            'name': '表格样式',
            'url': '#/table',
            'children': null
          },
          {
            'name': '表单样式',
            'url': '#/form',
            'children': null
          }
          ]
        },
        {
          'name': 'UI组件',
          'url': '#/widget',
          'children': [
            {
            'name': 'Admin UI组件',
            'params': {
              'id': '@id',
              'aid': '@aaa'
            },
            'url': '#/widget',
            'match': '/widget*',
            'children': null
          },
          {
            'name': 'Bootstrap组件',
            'url': '#/bootstrap-ui-widget',
            'children': null
          }
          ]
        },
        {
          'name': '其他页面',
          'url': '#/login',
          'children': [
            {
            'name': '登录页面',
            'url': '#/login',
            'children': null
          },
          {
            'name': '404页面',
            'url': '#/404',
            'children': null
          }
          ]
        },
        {
          'name': '升级指南',
          'url': '#/update-guide',
          'children': null
        }
        ]
      }
    });
  }]
);

adminuiApp
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/base-css', {
        templateUrl: 'views/base_css.html',
        controller: 'MainCtrl'
      })
      .when('/form', {
        templateUrl: 'views/form.html',
        controller: 'MainCtrl'
      })
      .when('/widget', {
        templateUrl: 'views/widget.html',
        controller: 'MainCtrl'
      })
      .when('/bootstrap-ui-widget', {
        templateUrl: 'views/bootstrap_ui_widget.html',
        controller: 'MainCtrl'
      })
      .when('/table', {
        templateUrl: 'views/table.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test2', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/sub/test3', {
        templateUrl: 'views/sub_page.html',
        controller: 'MainCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: 'MainCtrl'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'MainCtrl'
      })
      .when('/update-guide', {
        templateUrl: 'views/update_guide.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      //$locationProvider.html5Mode(true);
  }]);
