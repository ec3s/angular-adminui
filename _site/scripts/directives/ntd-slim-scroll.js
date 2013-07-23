'use strict';

angular.module('ntd.directives').directive('slimScroll', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        function getCurrentWindowH() {
          return $(window).width() < 767 ? 200 : $(window).height() - 80;
        }

        function initSlimScroll() {
          $('.slimScroll', element)
            .parent('.slimScrollDiv').css(
              { 'height': getCurrentWindowH() + 'px' }
            );

          $('.slimScroll', element)
            .css({ 'height': getCurrentWindowH() + 'px' })
            .slimscroll({
              distance: '2px'
            });
        }

        if (attrs.slimScrollMenu == 'yes') {
          var wrapper = '<div class="span2 affix">' +
                          '<div class="slimScroll"></div>' +
                        '</div>';
          $(element).children().wrap(wrapper);
          attrs.$observe('slimScroll', initSlimScroll);

          $(element).on('click', function() {
            $timeout(initSlimScroll, 200);
          });

          $(window).bind('load resize', initSlimScroll);
        } else {
          $(element).slimscroll({
            // width in pixels of the visible scroll area
            width: attrs.slimScrollWidth || 'auto',

            // height in pixels of the visible scroll area
            height: attrs.slimScrollHeight || '250px',

            // width in pixels of the scrollbar and rail
            size: attrs.slimScrollSize || '7px',

            // scrollbar color, accepts any hex/color value
            color: attrs.slimScrollColor || '#000',

            // scrollbar position - left/right
            position: attrs.slimScrollPosition || 'right',

            // distance in pixels between the side edge and the scrollbar
            distance: attrs.slimScrollDistance || '1px',

            // default scroll position on load - top / bottom / $('selector')
            start: 'top',

            // sets scrollbar opacity
            opacity: .4,

            // enables always-on mode for the scrollbar
            alwaysVisible: false,

            // check if we should hide the scrollbar when user is hovering over
            disableFadeOut: false,

            // sets visibility of the rail
            railVisible: false,

            // sets rail color
            railColor: attrs.slimScrollRailColor || '#333',

            // sets rail opacity
            railOpacity: .2,

            // whether  we should use jQuery UI Draggable to enable bar dragging
            railDraggable: true,

            // defautlt CSS class of the slimscroll rail
            railClass: 'slimScrollRail',

            // defautlt CSS class of the slimscroll bar
            barClass: 'slimScrollBar',

            // defautlt CSS class of the slimscroll wrapper
            wrapperClass: 'slimScrollDiv',

            // check if mousewheel should scroll the window
            // if we reach top/bottom
            allowPageScroll: false,

            // scroll amount applied to each mouse wheel step
            wheelStep: 20,

            // scroll amount applied when user is using gestures
            touchScrollStep: 200
          });
        }
      }
    };
  }
]);
