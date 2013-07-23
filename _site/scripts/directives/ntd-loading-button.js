'use strict';
angular.module('ntd.directives').directive('loadingButton', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        scope.$watch(
            function() {
                return scope.$eval(attrs.loadingButton);
            },
            function(value) {
                if (value) {
                    if (!attrs.hasOwnProperty('ngDisabled')) {
                        element.addClass('disabled')
                               .attr('disabled', 'disabled');
                    }
                    element.data('resetText', element.html());
                    element.html(element.data('loading-text'));
                } else {
                    if (!attrs.hasOwnProperty('ngDisabled')) {
                        element.removeClass('disabled').removeAttr('disabled');
                    }

                    element.html(element.data('resetText'));
                }
            }
        );
      }
  };
}]);
