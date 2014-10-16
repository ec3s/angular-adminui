'use strict';
angular.module('ntd.config', []).value('$ntdConfig', {});
var directiveApp = angular.module('ntd.directives',
  ['ntd.config', 'ngSanitize', 'angular-echarts', 'ng.shims.placeholder'
  ]);

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

var httpInterceptorFn = function(adminuiFrameProvider) {
  if (adminuiFrameProvider.hasOwnProperty('usedModules') &&
   angular.isArray(adminuiFrameProvider.usedModules)) {
    angular.forEach(adminuiFrameProvider.usedModules, function(module) {
      module.config(['$httpProvider', adminuiHttpInterceptor]);
    });
  }
};

directiveApp.config(['adminuiFrameProvider', httpInterceptorFn]);
