(function(ng) {
  'use strict';
  var AdminuiTimeLine = function($filter) {
    return {
      restrict: "EA",
      replace: true,
      require: "^ngModel",
      templateUrl: "templates/adminui-time-line.html",
      scope: true,
      link: function(scope, elem, attrs) {
        scope.timeLineDemoData = [];
        var tempTimeLineData = scope[attrs.ngModel];
        tempTimeLineData = $filter('orderBy')(tempTimeLineData, ['-time']);
        var currentObj = {};
        ng.forEach(tempTimeLineData, function(value, index) {
            var currentTime = $filter('date')(value.time, 'yyyy-MM-dd');
            if (!currentObj || currentObj.currentTime !== currentTime) {
              currentObj = {currentObj: []};
              currentObj.currentTime = angular.copy(currentTime);
              currentObj.currentObj.push(angular.copy(value));
              scope.timeLineDemoData.push(currentObj);
            }else {
              currentObj.currentObj.push(angular.copy(value));
            }
          }
        );
      }
    };
  };
  var TimeLineTemplate =
    function($http, $q, $compile, $templateCache) {
      return {
        restrict: "EA",
        replace: true,
        require: "^ngModel",
        link: function(scope, elem, attrs) {
          scope.adminuiTimeLine = scope[attrs.ngModel];
          var getTemplatePromise = function(options) {
            return options.template ? $q.when(options.template) : $http.get(options.templateUrl, {
              cache: $templateCache
            }).then(function(result) {
              return result.data;
            });
          };
          var currentHtml = null;
          if (scope.adminuiTimeLine.hasOwnProperty("content") && ng.isObject(scope.adminuiTimeLine.content)) {
            var contentScope = scope.$new(false);
            ng.extend(contentScope, scope.adminuiTimeLine.content);
            getTemplatePromise(scope.adminuiTimeLine).then(function(value) {
              currentHtml = $compile(value)(contentScope);
              elem.append(currentHtml);
            });
          }
        }
      };
  };

  ng.module('ntd.directives')
    .directive('adminuiTimeLine',
      ['$filter', AdminuiTimeLine]
    );
  ng.module('ntd.directives')
    .directive('timeLineTemplate',
      ['$http', '$q', '$compile', '$templateCache', TimeLineTemplate]
    );
})(angular);
