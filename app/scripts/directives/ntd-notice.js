/* notcie */
(function(ng) {
  'use strict';

  function noticeDirective($rootScope, $location, $timeout, noticeService) {
    return {
      restrict: 'EAC',
      replace: false,
      transclude: false,
      templateUrl: 'templates/adminui-notice.html',
      link: function() {
        var tempMessage;

        $rootScope.$on('event:notification', function(event, message) {
          if (message.redirect_url) {
            $timeout(function() {
              $location.path(message.redirect_url);
              tempMessage = message;
            }, 1500);
          } else {
            noticeService.addAlert(message);
          }
        });
        $rootScope.$on('event:flashMessageEvent', function(event, msg) {
          tempMessage = msg;
        });

        $rootScope.$on('$routeChangeStart', function() {
          $rootScope.alerts = [];
        });
        $rootScope.$on('$routeChangeSuccess', function() {
          if (tempMessage) {
            noticeService.addAlert(ng.copy(tempMessage));
          }
          tempMessage = null;
        });
      }
    };
  }
  ng.module('ntd.directives').directive('notice', [
      '$rootScope', '$location', '$timeout', 'noticeService',
      noticeDirective
    ]);
}(angular));
