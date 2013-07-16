'use strict';
angular.module('ntd.directives').directive('notice', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EAC',
    replace: false,
    transclude: false,
    link: function(scope, element, attr) {
      $rootScope.$on('event:notification', function(event, message) {
        var msgObj = {'info':'alert-info', 'error':'alert-error', 'success':'alert-success', 'warning': 'alert'};
        element.html('<div class="flash-message '+msgObj[message.state]+'"><strong>' + message.info + '</strong></div>');
        element
          .show()
          .delay(2500)
          .fadeOut('slow', function(){
            $(this).html('');
          });
      });
    }
  };
}]);
