(function(ng) {
  'use strict';
  var AdminuiTimeLine = function($compile, $parse, $timeout) {
    return {
      'restrict': 'EA',
      replace: true,
      'scope': {
        'ngModel': '=ngModel'
      },
      templateUrl: ngModel.template,
      link: function(scope, elem, attrs) {
        console.info(ngModel.template);
        console.info(ngModel);
      }
    };
  };

  ng.module('ntd.directives')
    .directive('adminuiTimeLine',
      ['$compile', '$parse', '$timeout', AdminuiTimeLine]
    );
})(angular);
