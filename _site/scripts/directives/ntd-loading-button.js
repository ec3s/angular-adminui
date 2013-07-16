'use strict';

angular.module('ntd.directives').directive('loadingButton', [function() {
  return {
    restrict: 'A',
    transclude: true,
    template: '<button ng-click="triggerAction($event)" ng-disabled="isProcessing" class="btn btn-primary" ng-transclude>' +
        '<i ng-show="isProcessing" class="icon-refresh icon-animate-refresh"></i>' +
        '&nbsp;' +
        '</button>',
    scope: {
      action: "&"
    },
    controller: function($scope) {
      $scope.isProcessing = false;

      $scope.triggerAction = function(e) {
        e.stopPropagation();
        console.log('in controller');
        $scope.isProcessing = true;
        $scope.action().then(function() {
          $scope.isProcessing = false;
        });
      };
    }
  }
}]);
