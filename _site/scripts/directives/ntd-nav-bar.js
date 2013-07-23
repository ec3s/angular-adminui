'use strict';
angular.module('ntd.directives').directive('navBar', ['$location',
  function($location) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs, controller) {
        scope.$watch(function() {
          return $location.path();
        }, function(newValue, oldValue) {
          $('li[data-match-route]', element).each(function(k, li) {
            var $li = angular.element(li),
                pattern = $li.attr('data-match-route'),
                regexp = new RegExp('^' + pattern + '$', ['i']);

            if (regexp.test(newValue)) {
              $li.addClass('active');
              if ($li.find('ul').length) {
                $li.addClass('opened').find('ul').show();
              }
            } else {
              $li.removeClass('active');
            }
          });
        });
      }
    };
  }
]);
