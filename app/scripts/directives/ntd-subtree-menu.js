/* sub tree menu */
(function() {
  'use strict';
  function subTreemenuDirective() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, cookieStore) {
        element.on('click', function(event) {
          var et = event.target;
          if (et.nodeName.toLowerCase() === 'a' && $(et).next('ul').length) {
              $(et).next('ul').slideToggle('fast');
              $(et).parent().toggleClass('opened');              
              $(et).bind('selectstart', function() { return false;});              
          }else{
            var url = $(et).attr('href');
            $('#bs2').attr('href','http://ec3s.github.io/angular-adminui/'+ url);
          }
          
        });
      }
    };
  }
  angular.module('ntd.directives').directive('subTreemenu', [subTreemenuDirective]);
}());

