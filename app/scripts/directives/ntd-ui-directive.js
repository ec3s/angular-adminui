'use strict';
angular.module('ntd.config', []).value('$ntdConfig', {});
var directiveApp = angular.module('ntd.directives',
  ['ntd.config', 'ngSanitize', 'angular-echarts', 'ng.shims.placeholder'
  ]);

