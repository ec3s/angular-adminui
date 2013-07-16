'use strict';
angular.module('ntd.directives').directive('advanceFilter', [
  function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var fieldsets = $(element).find('fieldset'),
            showFilterBtn = 'J_toggleShowFilterBtn',

            moreBtn = '<div class="more">'+
                        '<a data-class="J_toggleShowFilterBtn"><i class="icon-chevron-down"></i></a>'+
                      '</div>',

            primaryFieldset = fieldsets.eq(0),
            secondaryFieldset = fieldsets.eq(1);

        (function initAdvanceFilter () {
          $(element).append(moreBtn);
          $(':submit', element).clone().appendTo(primaryFieldset);

          primaryFieldset.addClass('skeleton');
          secondaryFieldset.hide();
        })();

        function toggleFilter ( filterElem ) {
          primaryFieldset.toggleClass('skeleton').fadeIn();
          secondaryFieldset.animate({
              height: ['toggle', 'swing'],
              opacity: ['toggle', 'swing'],
            }, 200, 'linear');

          primaryFieldset.find(':submit').toggle();
          $('.icon-chevron-down', element).toggleClass('icon-chevron-up');
        }

        function toggleFilterAction(e){
          var et = e.target
          if( ($(et).attr('data-class') || $(et).parent().attr('data-class')) === showFilterBtn ){
              toggleFilter(element);
          }
        }
        
        element.on('click', toggleFilterAction);
      }
    };
  }
]);