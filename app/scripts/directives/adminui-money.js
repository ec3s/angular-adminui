(function(ng) {
  'use strict';
  var money = function() {
    return function(scope, elem, attrs) {
      var oldValue, newValue, errorMsg;
      var max = null;
      if (attrs.max !== null) {
        max = parseFloat(attrs.max);
      }
      var formatInvalidate = function(value) {
        return value.split('.')[1] &&
        value.split('.')[1].length > 2;
      };
      var popEl = elem.popover({
        'placement': 'bottom',
        'delay': 0,
        'trigger': 'focus',
        'content': function() {
          return errorMsg;
        }
      });
      var numberInput = function() {
        var val = elem.val();
        newValue = parseFloat(val) || undefined;
        var caretPos = getCaretPosition(elem[0]) || 0;
        if ((max !== null && newValue > max) || formatInvalidate(val)) {
          if (formatInvalidate(val)) {
            errorMsg = '小数点后最多保留两位小数';
          } else if (newValue > max) {
            errorMsg = '金额不能大于最大值';
          }
          popEl.popover('show');
          setCaretPosition(this, caretPos - 1);
          newValue = oldValue;
          elem.val(newValue);
        } else {
          popEl.popover('hide');
        }
        oldValue = newValue;
      };

      elem.bind('input', numberInput);

      elem.bind('focus', function() {
        if (popEl) {
          popEl.popover('hide');
        }
      });

      var maxInitialize = function(value) {
        max = value || null;
      };

      attrs.$observe('max', maxInitialize);

      function getCaretPosition(input) {
        if (!ng.isUndefined(input.selectionStart)) {
          return input.selectionStart;
        } else if (document.selection) {
          // Curse you IE
          input.focus();
          var selection = document.selection.createRange();
          selection.moveStart('character', -input.value.length);
          return selection.text.length;
        }
        return 0;
      }

      function setCaretPosition(input, pos) {
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
          return; // Input's hidden
        }
        if (input.setSelectionRange) {
          input.focus();
          input.setSelectionRange(pos, pos);
        }
        else if (input.createTextRange) {
          // Curse you IE
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      }
    }
  };
  ng.module('ntd.directives')
    .directive('money',
      [money]);

  var adminuiMoney = function() {
    return{
      restrict: "A",
      templateUrl: "templates/replace-template.html",
      replace: "true"
    };
  };
  ng.module('ntd.directives')
    .directive('adminuiMoney',
      [adminuiMoney]);
})(angular);
