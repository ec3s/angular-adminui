/**
 * Created with JetBrains PhpStorm.
 * User: wangting
 * Date: 13-7-31
 * Time: 上午9:09
 */
 (function() {
  'use strict';
  function fieldErrorDirective() {
    return {
      template: '<span class="text-error" ng-show="showError" ng-transclude></span>',
      restrict: 'EAC',
      transclude: true,
      scope: {
        'for': '='
      },
      link: function(scope) {
        scope.$watch('{v: for.$invalid, d: for.$dirty}| json', function(v, ov) {
          v = JSON.parse(v);
          scope.showError = v.v && v.d;
        });
      }
    };
  }

  angular.module('ntd.directives').directive('fieldError', [fieldErrorDirective]);
 }());

