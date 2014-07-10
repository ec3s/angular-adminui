(function(ng) {
  'use strict';
  var TimeLine = function() {
    return {
      restrict: "EA",
      replace: true,
      require: "^ngModel",
      templateUrl: "templates/adminui-time-line.html",
      scope: true,
      link: function(scope, elem, attrs) {
        scope.timeLineDemoData = scope[attrs.ngModel];
      }
    };
  };
  var AdminuiTimeLine =
    function($compile) {
      return {
        restrict: "EA",
        replace: true,
        require: "^ngModel",
        link: function(scope, elem, attrs) {
          scope.adminuiTimeLine = scope[attrs.ngModel];
          var currentHtml = null;
          if (scope.adminuiTimeLine.hasOwnProperty("content") && ng.isObject(scope.adminuiTimeLine.content)) {
            var contentScope = scope.$new(false);
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
