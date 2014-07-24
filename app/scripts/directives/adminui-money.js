(function(ng){
  'use strict';
  var AdminuiMoney = function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        elem.maskMoney({prefix:'￥',allowZero:true,thousands:''});
        var parser = function () {
          ctrl.$viewValue = elem.maskMoney('unmasked')[0];
          return ctrl.$viewValue;
        };
        ctrl.$parsers.push(parser);
      }
    }
  };
  ng.module('ntd.directives')
    .directive('adminuiMoney',
      [AdminuiMoney]
    );
})(angular);
