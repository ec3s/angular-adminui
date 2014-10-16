(function(ng, document) {
  'use strict';
  var AlertAnimate = function() {
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
    return {
      leave: function(elem, done) {
        elem.slideUp('slow', done);
      },
      enter: function(elem) {
        if (!$(document.body).scrollTop()) {
          elem.parent().css({'position': 'static',
          'padding-left': '15px', 'padding-right': '15px'});
          if (!$('.message-supply').length) {
            elem.parent().after("<div class='message-supply'>");
          }
          elem.parent().next().css('position', 'fixed');
          elem.parent().next().css('min-height', elem.parent().height());
        } else {
          elem.parent().css({'position': 'fixed',
            'padding-left': '0', 'padding-right': '0'});
          if (!$('.message-supply').length) {
            elem.parent().after("<div class='message-supply'>");
          }
          elem.parent().next().css({'position': 'static',
            'min-height': 1});
        }
        $(window).scroll(debounce(function() {
          if (!$(document.body).scrollTop()) {
            elem.parent().css({'position': 'static',
              'padding-left': '15px', 'padding-right': '15px'});
            if (!$('.message-supply').length) {
              elem.parent().after("<div class='message-supply'>");
            }
            console.info(elem.parent().height());
            elem.parent().next().css('min-height', elem.parent().height());
            elem.parent().next().css('position', 'fixed');
          } else {
            elem.parent().css({'position': 'fixed',
              'padding-left': '0', 'padding-right': '0'});
            var messageSupply = $('.message-supply');
            if (!messageSupply.length) {
              elem.parent().after("<div class='message-supply'>");
            }
            elem.parent().next().css('position', 'static');
            elem.parent().next().animate({
              'min-height': 1});
          }
        }, 38));
      }
    };
  };

  ng.module('ntd.directives').animation('.alert-animation',
    [AlertAnimate]);
})(angular, document);
