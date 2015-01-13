(function(ng) {
  'use strict';
  var AdminuiDatePicker = function($compile, $parse, $timeout) {
    return {
      'restrict': 'A',
      'scope': {
        'ngModel': '=ngModel',
        'format': '@',
        'minDate': '@',
        'maxDate': '@',
        'viewMode': '@'
      },
      link: function(scope, elem, attrs) {
        elem.datepicker({
          language: 'zh-CN',
          keyboardNavigation: false,
          format: scope.format ? scope.format : 'yyyy-mm-dd',
          todayHighlight: true,
          startDate: scope.minDate ? scope.minDate : '',
          endDate: scope.maxDate ? scope.maxDate : '',
          autoclose: true,
          todayBtn: 'linked',
          startView: 0,
          minViewMode: scope.viewMode ? scope.viewMode : 0
        });
        var prevBtn = ng.element('<i></i>')
          .addClass('glyphicon glyphicon-arrow-left');
        var nextBtn = ng.element('<i></i>')
          .addClass('glyphicon glyphicon-arrow-right');
        var datepicker = elem.data('datepicker');
        datepicker.picker.find('.prev').html(prevBtn);
        datepicker.picker.find('.next').html(nextBtn);

        scope.$watch('ngModel', function(value, oldValue) {
          if (value) {
            datepicker.update(value);
          }
        });

        scope.$watch('minDate', function(value, oldValue) {
          if (value !== oldValue) {
            datepicker.setStartDate(value);
          }
        });
        scope.$watch('maxDate', function(value, oldValue) {
          if (value !== oldValue) {
            datepicker.setEndDate(value);
          }
        });
      }
    };
  };

  ng.module('ntd.directives')
    .directive('adminuiDatePicker',
      ['$compile', '$parse', '$timeout', AdminuiDatePicker]
    );
})(angular);
