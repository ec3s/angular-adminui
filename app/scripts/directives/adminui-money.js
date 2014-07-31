(function(ng){
  'use strict';
  var AdminuiMoney = function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var maxMoney;
        elem.maskMoney({prefix:'￥',allowZero:true,thousands:','});
        var initialize = function(value) {
          maxMoney = Number(value);
        };
        var parser = function () {
          if (maxMoney && elem.maskMoney('unmasked')[0] > maxMoney) {
            elem.maskMoney('mask', maxMoney);
          }
          ctrl.$viewValue = elem.maskMoney('unmasked')[0];
          return ctrl.$viewValue;
        };
        attrs.$observe('adminuiMoney', initialize);
        ctrl.$parsers.push(parser);
      }
    }
  };
  ng.module('ntd.directives')
    .directive('adminuiMoney',
      [AdminuiMoney]
    );
})(angular);
