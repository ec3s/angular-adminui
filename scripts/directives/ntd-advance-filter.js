'use strict';
angular.module('ntd.directives').directive('advanceFilter', [
  function() {
    var fieldsets,
        showFilterBtn,
        primaryFieldset,
        secondaryFieldset,
        template = '<div class="advance-search-filter">' +
                      '<div ng-transclude></div>' +
                      '<div class="more">' +
                          '<a data-class="J_toggleShowFilterBtn">' +
                            '<i class="icon-chevron-down"></i>' +
                          '</a>' +
                      '</div>' +
                    '</div>';

    function initAdvanceFilter(elem, attrs) {
      $(':submit', elem).clone().appendTo(primaryFieldset);
      primaryFieldset.addClass('skeleton');
      secondaryFieldset.hide();
      elem.bind('click', toggleFilterAction);
      if (attrs.advanceFilter === 'opened') {
        $('a[data-class="J_toggleShowFilterBtn"]').trigger('click');
      }
    };

    function toggleFilter(filterElem, elem) {
      primaryFieldset.toggleClass('skeleton').fadeIn();
      secondaryFieldset.animate({
          height: ['toggle', 'swing'],
          opacity: ['toggle', 'swing']
        }, 200, 'linear');

      primaryFieldset.find(':submit').toggle();
      $('.icon-chevron-down', elem).toggleClass('icon-chevron-up');
    }

    function toggleFilterAction(e, elem) {
      var et = e.target;
      if (($(et).attr('data-class') || $(et).parent().attr('data-class')) ===
          showFilterBtn) {
        toggleFilter(elem);
      }
    }
    return {
      restrict: 'A',
      template: template,
      transclude: true,
      link: function postLink(scope, element, attrs) {
        fieldsets = $(element).find('fieldset'),
        showFilterBtn = 'J_toggleShowFilterBtn',
        primaryFieldset = fieldsets.eq(0),
        secondaryFieldset = fieldsets.not(fieldsets.eq(0));

        initAdvanceFilter(element, attrs);

      }
    };
  }
]);
