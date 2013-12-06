/* lable state */
(function() {
  'use strict';
  function labelStateDirective() {
    return {
      restrict: 'A',
      transclude: true,
      scope: { tips: '@labelState' },
      template: '<span ng-transclude></span>' +
        '<i tooltip-popup-delay="300" ' +
        'tooltip="{{tips}}" class="glyphicon glyphicon-question-sign"></i>'
    };
  }
  
  angular.module('ntd.directives').directive('labelState', [labelStateDirective]);
}());
