'use strict';

angular.module('ntd.directives').directive('labelState', [
  function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: { desc:'=labelState' },
      template: '<span ng-transclude></span><i tooltip-popup-delay="300" tooltip="{{desc.title}}" class="icon-question-sign"></i>'
    };
  }
]);