(function(ng) {
  'use strict';
  var AdminuiDaterange = function($compile, $parse, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attributes, ngModel) {
        $element.attr('readonly', true);
        $element.css('background-color', 'white');
        var options = {};
        options.format = $attributes.format || 'YYYY-MM-DD';
        options.separator = $attributes.separator || ' - ';
        options.minDate = $attributes.minDate && moment($attributes.minDate);
        options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
        options.dateLimit = $attributes.limit &&
          moment.duration.apply(
            this, $attributes.limit.split(' ').map(
              function(elem, index) {
                return index === 0 && parseInt(elem, 10) || elem;
              }
            )
          );
        options.ranges = $attributes.ranges &&
          $parse($attributes.ranges)($scope);
        options.locale = {
          'applyLabel': '应用',
          'cancelLabel': '取消',
          'customRangeLabel': '自定义'
        };

        options.opens = $attributes.opens || 'auto';


        $timeout(function() {
          var dateRangePicker = $element.data('daterangepicker');
          var oldMove = ng.copy(dateRangePicker.move);
          dateRangePicker.move = function() {
            var parentOffset = { top: 0, left: 0 };
            if (!this.parentEl.is('body')) {
              parentOffset = {
                top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                left: this.parentEl.offset().left - this.parentEl.scrollLeft()
              };
            }
            if (options.opens == 'auto') {
              this.container.css({
                top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                left: this.element.offset().left - parentOffset.left,
                right: 'auto'
              }).addClass('opensright');
              if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                this.container.css({
                  top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                  right: $(window).width() - this.element.offset().left - this.element.outerWidth() - parentOffset.left,
                  left: 'auto'
                }).addClass('opensleft').removeClass('opensright');
                if (this.container.offset().left < 0) {
                  this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                  }).addClass('opensright').removeClass('opensleft');
                }
              }

              var leftCalendar = this.container.find('.calendar.left');
              var rightCalendar = this.container.find('.calendar.right');

              if (this.container.hasClass('opensright')) {
                rightCalendar.after(leftCalendar);
              } else {
                leftCalendar.after(rightCalendar);
              }

            } else {
              if (this.opens == 'left') {
                this.container.css({
                  top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                  right: $(window).width() - this.element.offset().left - this.element.outerWidth() - parentOffset.left,
                  left: 'auto'
                });
              } else {
                this.container.css({
                  top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                  left: this.element.offset().left - parentOffset.left,
                  right: 'auto'
                });
              }
            }
          };

          var resetBtn = ng.element('<button>清空</button>')
            .addClass('cancelBtn btn btn-default').bind('click', function() {
              $scope.$apply(function() {
                ($parse($attributes.ngModel).assign)($scope, null);
              });
            });
          $element.data('daterangepicker')
            .container.find('.applyBtn').bind('click', function() {
            $scope.$apply(function() {
              ngModel.$setViewValue({
                startDate: $element.data('daterangepicker').startDate.toDate(),
                endDate: $element.data('daterangepicker').endDate.toDate()
              });
            });
          });
          $element.data('daterangepicker')
            .container.find('.applyBtn').after(resetBtn);
        });

        function format(date) {
          return date.format(options.format);
        }

        function formatted(dates) {
          return [format(dates.startDate), format(dates.endDate)]
            .join(options.separator);
        }

        ngModel.$formatters.unshift(function(modelValue) {
          if (!modelValue) return '';
          return modelValue;
        });

        ngModel.$parsers.unshift(function(viewValue) {
          return viewValue;
        });

        $scope.$watch($attributes.ngModel, function(modelValue) {
          if (!modelValue || (!modelValue.startDate)) {
            return;
          }
          $element.data('daterangepicker').startDate =
            moment(modelValue.startDate);
          $element.data('daterangepicker').endDate = moment(modelValue.endDate);
          $element.data('daterangepicker').updateView();
          $element.data('daterangepicker').updateCalendars();
          $element.data('daterangepicker').updateInputText();
        });

        $element.daterangepicker(options, function(start, end) {
          $scope.$apply(function() {
            ngModel.$setViewValue({
              startDate: start.toDate(),
              endDate: end.toDate()
            });
          });
        });
      }
    };
  };
  ng.module('ntd.directives')
    .directive('adminuiDaterangePicker',
      ['$compile', '$parse', '$timeout', AdminuiDaterange]
    );
})(angular);
