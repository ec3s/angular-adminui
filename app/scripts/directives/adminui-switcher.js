(function(ng) {
  'use strict';
  var Switcher = function(elem, status, disabled) {
    this.elem = elem;
    this.onAnimate = false;
    this.initialize();
    this.setStatus(status, true);
    this.disabled(disabled);
  };

  Switcher.prototype.setStatus = function(status, setOffset) {
    if (status === true) {
      this.elem.addClass('on');
      this.elem.removeClass('off');
    } else {
      this.elem.addClass('off');
      this.elem.removeClass('on');
      if (setOffset) {
        this.innerElem.css('left', - this.onElem.outerWidth());
      }
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
    elem.width(elemWidth + dividerElemWidth + 2);
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
    this.setStatus(newValue);
    this.innerElem.animate({
      left: offset
    }, 200, function() {
      this.onAnimate = false;
      if (callback) {
        callback.call(this, newValue);
      }
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
            var switchedFunc = null;
            var clickEvent = null;
            if (!switcher.onAnimate && !scope.disabled) {
              if (e.button !== 0) {
                return;
              }
              clickEvent = {
                '$event': {
                  'type': 'SWITCHER_CLICK',
                  'name': 'click',
                  'target': elem,
                  'oldValue': scope.model,
                  'value': !scope.model,
                  'switched': function(callback) {
                    switchedFunc = callback;
                  }
                }
              };
              scope.ngClick(clickEvent);
              switcher.switch(scope.model, function(value) {
                scope.$apply(function() {
                  scope.model = value;
                  if (switchedFunc !== null) {
                    switchedFunc.call(clickEvent, value, !value);
                  }
                });
              });
            }
          });

          scope.$watch('disabled', function(value, oldValue) {
            if (value != oldValue) {
              switcher.disabled(value);
              switcher.switch(!scope.model, function(newValue) {
                scope.$apply(function() {
                  scope.model = newValue;
                });
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
              switcher.switch(oldValue);
            }
          });
        });
      }
    };
  };

  ng.module('ntd.directives')
  .directive('adminuiSwitcher', ['$timeout', SwitcherDirective]);
})(angular);
