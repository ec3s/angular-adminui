(function(ng) {
  'use strict';
  var AdminuiTimeLine =
    function($compile) {
    return {
      'restrict': 'EA',
      replace: true,
      'scope': {
        'adminuiTimeLine': '=adminuiTimeLine'
      },
      transclude: true,
      link: function(scope, elem, attrs) {
        var currentHtml = $compile(scope.adminuiTimeLine.template)(scope);
        elem.append(currentHtml);
      }
    };
  };

  ng.module('ntd.directives')
    .directive('adminuiTimeLine',
      ['$compile', AdminuiTimeLine]
    );
})(angular);
