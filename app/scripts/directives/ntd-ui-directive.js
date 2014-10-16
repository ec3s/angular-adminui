'use strict';
window.adminConfigApp = angular.module('ntd.config', []).value('$ntdConfig', {});
angular.module('ntd.directives',
  ['ntd.config', 'ngSanitize', 'angular-echarts', 'ng.shims.placeholder'
  ]);

var httpInterceptorFn = function($httpProvider, $provide) {
    $provide.factory("AdminuiHttpInterceptor", function() {
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

window.adminConfigApp.config(['$httpProvider', '$provide', httpInterceptorFn]);
