'use strict';
/* sub tree menu */
angular.module('ntd.directives').directive('subTreemenu', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, cookieStore) {
        element.on('click', function(event) {
          var et = event.target;
          if (et.nodeName.toLowerCase() === 'a' && $(et).next('ul').length) {
              $(et).next('ul').slideToggle('fast');
              $(et).parent().toggleClass('opened');
              $(et).bind('selectstart', function() { return false;});
          }
        });
      }
    };
  }
]);
