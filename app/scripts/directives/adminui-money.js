(function(ng) {
  'use strict';
  var adminuiMoney = function($parse) {
    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

    function link(scope, el, attrs, ngModelCtrl) {
      var getter = $parse(attrs.ngModel);
      (getter.assign)(scope, getter(scope) || 0);
      var max,errorMsg,newValue,lastValidValue;
      var precision = parseFloat(attrs.precision || 2);
      var min = parseFloat(attrs.min || 0);
      var popEl = el.popover({
        'placement': 'bottom',
        'delay': 0,
        'trigger': 'focus',
        'content': function() {
          return errorMsg;
        }
      });

      function floor(num) {
        var d = Math.pow(10, precision);
        return Math.floor(num * d) / d;
      }

      function formatPrecision(value) {
        return parseFloat(value).toFixed(precision);
      }

      function formatViewValue(value) {
        return ngModelCtrl.$isEmpty(value) ? "" : "" + value;
      }

      var formatInvalidate = function(value) {
        return value.split('.')[1] &&
          value.split('.')[1].length > 2;
      };

      ngModelCtrl.$parsers.push(function (value) {
        // Handle leading decimal point, like ".5"
        if (value.indexOf('.') === 0) {
          value = '0' + value;
        }

        // Allow "-" inputs only when min < 0
        if (value.indexOf('-') === 0) {
          if (min >= 0) {
            value = null;
            ngModelCtrl.$setViewValue('');
            ngModelCtrl.$render();
          } else if (value === '-') {
            value = '';
          }
        }

        var empty = ngModelCtrl.$isEmpty(value);
        if (empty || NUMBER_REGEXP.test(value)) {
          lastValidValue = (value === '')
            ? null
            : (empty ? value : parseFloat(value));
        } else {
          // Render the last valid input in the field
          ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
          ngModelCtrl.$render();
        }

        ngModelCtrl.$setValidity('number', true);
        return lastValidValue;
      });

      var numberInput = function() {
        var val = el.val();
        newValue = parseFloat(val) || 0;
        if ((max !== null && newValue > max) || formatInvalidate(val)) {
          if (formatInvalidate(val)) {
            errorMsg = '小数点后最多保留两位小数';
          } else if (newValue > max) {
            errorMsg = '金额不能大于最大值';
          }
          popEl.popover('show');
          el.val(ngModelCtrl.$modelValue || 0);
        } else {
          var transformValue = newValue === 0 ?
            0 : val.substr(val.search(/[1-9]/));
          el.val(transformValue);
          popEl.popover('hide');
        }
      };

      var maxValidator = function(value) {
        if (max !== null && value > max) {
          ngModelCtrl.$setValidity('max', false);
          return ngModelCtrl.$modelValue || 0;
        } else {
          ngModelCtrl.$setValidity('max', true);
          return value || 0;
        }
      };
      el.bind('input', numberInput);
      var maxInitialize = function(value) {
        max = parseFloat(value) ? value : null;
        if(parseFloat(value) === 0 ){
          max = value;
        }
      };
      if (ng.isDefined(attrs.max)){
        attrs.$observe('max', maxInitialize);
        ngModelCtrl.$parsers.push(maxValidator);
      }

      el.bind('focus', function() {
        if (popEl) {
          popEl.popover('hide');
        }
      });

      // floor off
      if (precision > -1) {
        ngModelCtrl.$parsers.push(function (value) {
          return value ? floor(value) : value;
        });
        ngModelCtrl.$formatters.push(function (value) {
          return value ? formatPrecision(value) : value;
        });
      }

      el.bind('blur', function () {
        var value = ngModelCtrl.$modelValue;
        if (value) {
          ngModelCtrl.$viewValue = formatPrecision(value);
          ngModelCtrl.$render();
        }
      });

    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };
  };
  ng.module('ntd.directives')
    .directive('adminuiMoney',
      ["$parse", adminuiMoney]);
})(angular);
