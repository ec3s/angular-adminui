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
        'tooltip="{{tips}}" class="icon-question-sign"></i>'
    };
  }
  
  angular.module('ntd.directives').directive('labelState', [labelStateDirective]);
}());
