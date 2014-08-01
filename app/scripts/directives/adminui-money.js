(function(ng){
  'use strict';
  var money = function(flash) {
    return function (scope, elem, attrs) {
      var oldValue,newValue;
      var min = parseFloat(attrs.min || 0);
      var max = parseFloat(attrs.max || 0);
      var precision = parseFloat(attrs.precision || 2);
      var numberInput = function () {
        newValue = elem.val();
        var caretPos = getCaretPosition(elem[0]) || 0;
        if(newValue > max ||
          (newValue.split('\.')[1] && newValue.split('\.')[1].length > 2)) {
          var infoMessage = newValue > max ? '金钱不得大于最大值' : '小数点后最多只能有两位';
          flash.notify({state: 'error', info: infoMessage});
          setCaretPosition(this, caretPos-1);
          newValue = oldValue;
          elem.val(newValue);
        }
        oldValue = newValue;
      };

      elem.bind('input', numberInput);

      var maxInitialize = function(value) {
        max = parseFloat(value || 0);
      };

      attrs.$observe('max', maxInitialize);

      function getCaretPosition(input) {
        if (input.selectionStart !== undefined) {
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
  ng.module('money', ['fiestah.money'])
    .directive('money',
      ['flash', money]);
})(angular);
