(function() {
  'use strict';
  function toggleSwitcherDirective($timeout) {
    return {
      restrict: 'AC',
      replace: true,
      scope: {
        ngTrueTitle: '@',
        ngFalseTitle: '@',
        ngTrueValue: '@',
        ngFalseValue: '@',
        ngDisabled: '=',
        id: '@',
        name: '@',
        ngModel: '=',
        ngChange: '&',
        ngClick: '&'
      },
      template: '<label class="checkbox toggle">' +
      '<input id="{{id}}" name="{{name}}"' +
      ' type="checkbox" ng-model="checked">' +
      '<p>' +
      '<span>{{ngTrueTitle}}</span>' +
      '<span>{{ngFalseTitle}}</span>' +
      '</p>' +
      '<a class="btn slide-button"></a>' +
      '</label>',
      link: function(scope, element, attrs) {
        var trueValue = attrs.ngTrueValue ? attrs.ngTrueValue : true;
        var falseValue = attrs.ngFalseValue ? attrs.ngFalseValue : false;
        var eventModel = scope.$new(true);
        element.bind('click', function(event) {
          if (event.target.nodeName.toLowerCase() === 'input') {
            eventModel.$event = {
              originalEvent: event,
              data: scope.ngModel,
              target: element,
              type: 'click'
            };
            scope.ngClick(eventModel);
          }
        });
        scope.$watch('checked', function(value, oldValue) {
          if (value !== oldValue) {
            scope.ngModel = value ? trueValue : falseValue;
          }
        }, true);
        scope.$watch('ngDisabled', function(value) {
          if (value) {
            element.find('input').attr('disabled', true);
            element.addClass('disabled');
          } else {
            element.find('input').attr('disabled', false);
            element.removeClass('disabled');
          }
        });
        scope.$watch('ngModel', function(value, oldValue) {
          scope.checked = (value === trueValue) ? true : false;
          if (value !== oldValue) {
            eventModel.$event = {
              data: {
                value: value,
                oldValue: oldValue
              },
              target: element,
              type: 'change'
            };
            scope.ngChange(eventModel);
          }
        }, true);
        $timeout(function() {
          // calculate span width to set element width
          var spanWidth = element.find('span').outerWidth();
          element.width(spanWidth * 2).find('span:last').css('left', spanWidth);
        });
      }
    };
  }
  angular.module('ntd.directives').directive(
    'toggleSwitcher', ['$timeout', toggleSwitcherDirective]
  );
}());
