/* flash message */
(function() {
  'use strict';
  function build_msg(type, message) {
    var html = '<div class="alert alert-' + type + '">' +
        message +
        '<button type="button" class="close">×</button>' +
      '</div>';
    return html;
  }

  function flashAlertDirective($rootScope, $timeout) {
    return {
      scope: true,
      restrict: 'EAC',
      link: function($scope, element, attr) {
        var html_fragement = '';
        $rootScope.$on('event:flashMessageEvent', function(event, msg) {
          if (angular.isArray(msg)) {
            angular.forEach(msg, function(item, key) {
              html_fragement += build_msg(item.state, item.info);
            });
          } else {
            html_fragement += build_msg(msg.state, msg.info);
          }
        });

        $rootScope.$on('$routeChangeSuccess', function() {
          // remove old message when route changed
          element.empty();
          if (html_fragement) {
            element.append(html_fragement);
            $('.close', element).bind('click', function() {
              $(this).parent('.alert').fadeOut(function() {
                $(this).remove();
              });
            });
            html_fragement = '';
          }
        });
      }
    };
  }

  angular.module('ntd.directives').directive('flashAlert', [
    '$rootScope',
    '$timeout',
    flashAlertDirective
  ]);
}());
