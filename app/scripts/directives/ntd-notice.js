/* notcie */
(function(ng) {
  'use strict';

  function noticeDirective($rootScope, $location, $timeout, noticeService) {
    return {
      restrict: 'EAC',
      replace: false,
      transclude: false,
      templateUrl: 'templates/adminui-notice.html',
      link: function(scope, elem) {
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
        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        var debounce = function(func, wait, immediate) {
          var timeout;
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
          };
        };
        if (!$(window).scrollTop()) {
          elem.css({'position': 'static',
            'padding-left': '15px', 'padding-right': '15px'});
          if (!$('.message-supply').length) {
            elem.after("<div class='message-supply'>");
          }
          elem.next().css('position', 'fixed');
          elem.next().css('min-height', elem.height());
        } else {
          elem.css({'position': 'fixed',
            'padding-left': '0', 'padding-right': '0'});
          if (!$('.message-supply').length) {
            elem.after("<div class='message-supply'>");
          }
          elem.next().css({'position': 'static',
            'min-height': 0});
        }
        $(window).scroll(debounce(function() {
          if (!$(window).scrollTop()) {
            elem.css({'position': 'static',
              'padding-left': '15px', 'padding-right': '15px'});
            if (!$('.message-supply').length) {
              elem.after("<div class='message-supply'>");
            }
            elem.next().css('min-height', elem.height());
            elem.next().css('position', 'fixed');
          } else {
            elem.css({'position': 'fixed',
              'padding-left': '0', 'padding-right': '0'});
            var messageSupply = $('.message-supply');
            if (!messageSupply.length) {
              elem.after("<div class='message-supply'>");
            }
            elem.next().css('position', 'static');
            elem.next().animate({
              'min-height': 0});
          }
        }, 10));

      }
    };
  }
  ng.module('ntd.directives').directive('notice', [
      '$rootScope', '$location', '$timeout', 'noticeService',
      noticeDirective
    ]);
}(angular));
