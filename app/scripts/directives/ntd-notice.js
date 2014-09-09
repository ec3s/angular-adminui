/* notcie */
(function() {
  'use strict';
  var msgObj = {
    'info': 'alert-info',
    'error': 'alert-danger',
    'success': 'alert-success',
    'warning': 'alert-warning'
  };

  var alertModel = function(message) {
    return '<div class="alert ' +
      msgObj[message.state] + '">' +
      '<strong>' + message.info + '</strong>' +
      '<button type="button" class="close">×</button>' +
      '</div>';
  };

  function noticeDirective($rootScope, $location, $timeout) {
    return {
      restrict: 'EAC',
      replace: false,
      transclude: false,
      link: function(scope, element, attr) {
        var html_fragement = '';
        var flag = false;
        var buildHtml = function(msg) {
          if (angular.isArray(msg)) {
            angular.forEach(msg, function(item) {
              html_fragement += alertModel(item);
            });
          } else {
            html_fragement += alertModel(msg);
          }
        };
        var appendAndAddCloseListener = function() {
          element.append(html_fragement);
          element.next().css('padding-top', element.height());
          $('.close', element).bind('click', function() {
            $(this).parent('.alert').fadeOut(function() {
              $(this).remove();
              element.next().css('padding-top', element.height());
            });
          });
          html_fragement = '';
        };

        $rootScope.$on('event:notification', function(event, message) {
          flag = true;
          buildHtml(message);
          appendAndAddCloseListener();

          if (message.redirect_url) {
            $timeout(function() {
              $location.path(message.redirect_url);
            }, 1500);
          }
        });
        $rootScope.$on('event:flashMessageEvent', function(event, msg) {
          flag = false;
          buildHtml(msg);
        });

        $rootScope.$on('$routeChangeSuccess', function() {
          if (flag) {
            element.empty();
            element.next().css('padding-top', 0);
          } else {
            element.empty();
            appendAndAddCloseListener();
          }
        });
      }
    };
  }
  angular.module('ntd.directives').directive('notice', [
    '$rootScope', '$location', '$timeout',
    noticeDirective
  ]);
}());
