'use strict';

angular.module('ntd.directives').directive('nanoScrollbar', ['$timeout', 
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var wrapper = '<div class="span2 affix"><div class="nano"><div class="content"></div></div></div>';

        $(element).children().wrap(wrapper);

        function initNanoScrollBar(){
          
          var config = {
              height: function () {
                return $(window).width() < 767 ? 200 : $(window).height() - 80 ;
              },
              showScrollBar: function () {
                return $(window).width() < 767 ? true : false ;
              }
          };

          $('.nano', element)
            .css({ 'height': config.height() })
            .nanoScroller({
              preventPageScrolling: true,
              iOSNativeScrolling: true,
              alwaysVisible: config.showScrollBar()
          });
        }

        attrs.$observe('nanoScrollbar', initNanoScrollBar);

        $(element).on('click', function(){
          $timeout(initNanoScrollBar, 200);
        });

        $(window).bind('load resize', initNanoScrollBar);

      }
    };
  }
]);