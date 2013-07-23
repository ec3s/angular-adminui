'use strict';
angular.module('ntd.directives').directive('notice', [
  '$rootScope',
  function($rootScope) {

    var msgObj = {
      'info': 'alert-info',
      'error': 'alert-error',
      'success': 'alert-success',
      'warning': 'alert'
    };

    function buildHtml(message) {
      var closeBtn = '';
      if (message.state === 'error' || message.state === 'warning') {
        closeBtn = '<button class="close">x</button>';
      }
      var noticeHtml = '<div class="flash-message ' +
                          msgObj[message.state] + '">' +
                          '<strong>' + message.info + '</strong>' +
                          closeBtn +
                        '</div>';
      return noticeHtml;
    }

    return {
      restrict: 'EAC',
      replace: false,
      transclude: false,
      link: function(scope, element, attr) {
        $rootScope.$on('event:notification', function(event, message) {

          element.html(buildHtml(message));
          if (element.find('button').length) {
            element
              .show()
              .find('button').on('click', function() {
                element.hide();
              });
          } else {
            element
            .show()
            .delay(2500)
            .fadeOut('slow', function() {
              $(this).empty();
            });
          }

        });
      }
    };
  }
]);
