(function(ng) {
  'use strict';
  var TimeLine = function() {
    return {
      restrict: "E",
      replace: true,
      require:'^ngModel',
      templateUrl: "templates/adminui-time-line.html",
      transclude: true,
      link: function(scope, elem, attrs, ctrl) {
        scope.timeLineDemoData = angular.copy(scope[attrs.ngModel]);
      }
    };
  };
  var AdminuiTimeLine =
    function($compile) {
    return {
      'restrict': 'EA',
      replace: false,
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
    .directive('timeLine',
      [TimeLine]
    );
  ng.module('ntd.directives')
    .directive('adminuiTimeLine',
      ['$compile', AdminuiTimeLine]
    );
})(angular);
