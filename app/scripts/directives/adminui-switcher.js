(function(ng) {
  'use strict';
  var Switcher = function(elem, status, disabled) {
    this.elem = elem;
    this.onAnimate = false;
    this.initialize();
    this.setStatus(status);
    this.disabled(disabled);
  };

  Switcher.prototype.setStatus = function(status) {
    if (status === true) {
      this.elem.addClass('on');
      this.elem.removeClass('off');
    } else {
      this.elem.addClass('off');
      this.elem.removeClass('on');
      this.innerElem.css('left', - this.onElem.outerWidth());
    }
  };

  Switcher.prototype.disabled = function(disabled) {
    if (disabled) {
      this.elem.addClass('disabled');
    } else {
      this.elem.removeClass('disabled');
    }
  };

  Switcher.prototype.initialize = function() {
    var elem = this.elem;
    var innerElem = this.innerElem = elem.find('.adminui-switcher-inner');
    var onElem = this.onElem = elem.find('.on-label');
    var offElem = this.offElem = elem.find('.off-label');
    var onElemWidth = onElem.outerWidth();
    var offElemWidth = offElem.outerWidth();
    var dividerElemWidth = elem.find('.divider').outerWidth();
    var elemWidth = Math.max(onElemWidth, offElemWidth);
    elem.width(elemWidth + dividerElemWidth);
    onElem.css('width', elemWidth);
    offElem.css('width', elemWidth);
    innerElem.width(
      elemWidth * 2 + dividerElemWidth
    );
  };

  Switcher.prototype.switch = function(value, callback) {
    var newValue = !value;
    var elem = this.elem;
    var offset;
    if (newValue == true) {
      offset = 0;
    } else {
      offset = - this.onElem.outerWidth();
    }
    this.onAnimate = true;
    this.innerElem.animate({
      left: offset
    }, function() {
      this.onAnimate = false;
      callback.call(this, newValue);
      this.setStatus(newValue);
    }.bind(this));
  };

  var SwitcherDirective = function($timeout) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        model: '=ngModel',
        disabled: '=disabled',
        ngChange: '&',
        ngClick: '&',
        onLabel: '@',
        offLabel: '@'
      },
      templateUrl: 'templates/adminui-switcher.html',
      link: function(scope, elem, attrs) {
        $timeout(function() {
          var switcher = new Switcher(elem, scope.model, scope.disabled);
          elem.bind('click', function(e) {
            if (!switcher.onAnimate && !scope.disabled) {
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

          scope.$watch('disabled', function(value, oldValue) {
            if (value != oldValue) {
              switcher.disabled(value);
              switcher.switch(!scope.model, function(newValue) {
                scope.model = newValue;
                scope.$apply();
              });
            }
          });

          scope.$watch('model', function(value, oldValue) {
            if (value !== oldValue && !scope.disabled) {
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
        });
      }
    };
  };

  ng.module('ntd.directives')
  .directive('adminuiSwitcher', ['$timeout', SwitcherDirective]);
})(angular);
