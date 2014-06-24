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
        var currentHtml = null;
        if (scope.adminuiTimeLine.hasOwnProperty('content') &&
          ng.isObject(scope.adminuiTimeLine.content)) {
          var contentScope = scope.$new(true);
          ng.extend(contentScope, scope.adminuiTimeLine.content);
          currentHtml = $compile(scope.adminuiTimeLine.template)(contentScope);
        }
        elem.append(currentHtml);
      }
    };
  };

  ng.module('ntd.directives')
    .directive('adminuiTimeLine',
      ['$compile', AdminuiTimeLine]
    );
})(angular);
