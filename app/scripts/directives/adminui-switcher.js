(function(ng) {
  'use strict';
  var Switcher = function(elem) {
    this.elem = elem;
    this.onAnimate = false;
    this.initialize();
  };

  Switcher.prototype.initialize = function() {
    var elem = this.elem;
    var innerElem = this.innerElem = elem.find('.adminui-switcher-inner');
    var onElemWidth = this.onElemWidth = elem.find('.on-label').outerWidth();
    var offElemWidth = this.offElemWidth = elem.find('.off-label').outerWidth();
    var dividerElemWidth = elem.find('.divider').outerWidth();
    var elemWidth = Math.max(onElemWidth, offElemWidth) + dividerElemWidth;
    elem.css('width', elemWidth);
    innerElem.css(
      'width',
      onElemWidth + offElemWidth + dividerElemWidth
    );
  };

  Switcher.prototype.switch = function(value, callback) {
    var newValue = !value;
    var elem = this.elem;
    var offset;
    if (newValue == true) {
      offset = 0;
    } else {
      offset = - this.onElemWidth;
    }
    this.onAnimate = true;
    this.innerElem.animate({
      left: offset
    }, function() {
      callback.call(this, newValue);
      this.onAnimate = false;
    }.bind(this));
  };

  var SwitcherDirective = function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        model: '=ngModel',
        ngChange: '&',
        ngClick: '&',
        onLabel: '@',
        offLabel: '@'
      },
      templateUrl: 'templates/adminui-switcher.html',
      link: function(scope, elem, attrs) {
        var switcher = new Switcher(elem);
        elem.bind('click', function(e) {
          if (!switcher.onAnimate) {
            if (e.button !== 0) {
              return;
            }
            scope.ngClick({
              '$event': {
                'type': 'SWITCHER_CLICK',
                'name': 'click',
                'target': elem,
                'oldValue': scope.model,
                'value': !scope.model
              }
            });
            switcher.switch(scope.model, function(value) {
              scope.model = value;
              scope.$apply();
            });
          }
        });

        scope.$watch('model', function(value, oldValue) {
          if (value !== oldValue && !switcher.onAnimate) {
            scope.ngChange({
              '$event': {
                'type': 'SWITCHER_CHANGE',
                'name': 'change',
                'target': elem,
                'oldValue': oldValue,
                'value': value
              }
            });
            switcher.switch(oldValue, function(newValue) {
              scope.model = newValue;
              scope.$apply();
            });
          }
        });
      }
    };
  };

  ng.module('ntd.directives')
  .directive('adminuiSwitcher', [SwitcherDirective]);
})(angular);
