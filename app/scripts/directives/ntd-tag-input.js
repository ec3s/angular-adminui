/**
 * tag input directive
 *
 * attribute:
 *  data-ng-model array
 *  标签列表
 *  data-placeholder string
 *  占位提示信息
 *  data-allways-placeholder bool
 *  是否一直显示占位提示信息,默认为否
 *  data-unique bool
 *  标签是否唯一,默认为是
 *
 *  @author Fengming Sun <sunfengming@ec3s.com>
 */
(function() {
  'use strict';
  function tagInputDirective() {
    return {
      restrict: 'AC',
      replace: true,
      scope: {
        tags: '=ngModel',
        placeholder: '@',
        id: '@'
      },
      template: '<div class="tag-input-container">' +
      '<ul data-ng-class="{true: \'focus\'}[isFocus]">' +
      '<li class="tag" data-ng-repeat="tag in tags">' +
      '<span>{{tag}}</span>' +
      '<i data-ng-click="remove($index)" class="icon-remove"></i>' +
      '</li>' +
      '<li class="input-li">' +
      '<input id="{{id}}" data-ng-model="tagInput"' +
      ' placeholder="{{placeholder}}" type="text" autocomplete="false" />' +
      '</li>' +
      '</ul>' +
      '</div>',
      link: function(scope, elem, attrs) {
        var placeholder = attrs.placeholder;
        var caseSensitive = attrs.caseSensitive || false;
        var allwaysPlaceholder = scope.$eval(
          attrs.allwaysPlaceholder
        ) || false;
        var unique = scope.$eval(attrs.unique) || true;
        var uniqueTags = [];
        var oldInput;

        // 查看tag 所处位置
        var indexOf = function(tags, tag) {
          if (!caseSensitive) {
            tag = tag.toLowerCase();
            tags = tags.join(',').toLowerCase().split(',');
          }
          return tags.indexOf(tag);
        };

        if (!angular.isArray(scope.tags)) {
          scope.tags = [];
        }

        if (unique) {
          angular.forEach(scope.tags, function(item) {
            if (indexOf(uniqueTags, item) === -1) {
              uniqueTags.push(item);
            }
          });
          scope.tags = uniqueTags;
        }

        // 删除按钮
        scope.remove = function(index) {
          scope.tags.splice(index, 1);
        };

        elem.find('input').bind('focus', function() {
          scope.isFocus = true;
          scope.$apply();
        });

        elem.find('input').bind('blur', function() {
          scope.isFocus = false;
          scope.$apply();
        });

        elem.bind('click', function() {
          elem.find('input').focus();
        });

        // 删除前面的标签
        elem.find('input').bind('keyup', function(e) {
          // record input
          if (oldInput != scope.tagInput) {
            oldInput = scope.tagInput;
          } else if (e.keyCode == 8 && scope.tags.length > 0) {
            if (oldInput == scope.tagInput) {
              scope.tags.pop();
              scope.$apply();
            }
          }
        });

        // 观察标签变动
        scope.$watch('tags', function(newValue, oldValue) {
          if (!allwaysPlaceholder) {
            if (angular.isArray(newValue) && newValue.length > 0) {
              elem.find('input').attr('placeholder', '');
            } else {
              elem.find('input').attr('placeholder', placeholder);
            }
          }
        }, true);

        // 监听输入
        scope.$watch('tagInput', function(newValue, oldValue) {
          if (newValue != oldValue) {
            var lastChar = newValue.substr(-1, 1);
            if (lastChar == ';' || lastChar == '；') {
              if (oldValue) {
                var index = indexOf(scope.tags, oldValue);
                if (!unique || index === -1) {
                  scope.tags.push(oldValue);
                } else {
                  angular.element(elem.find('li')[index])
                  .fadeTo('fast', 0.2).fadeTo('fast', 1);
                }
              }
              scope.tagInput = '';
            }
          }
        });
      }
    };
  }
  angular.module('ntd.directives').directive('tagInput', [tagInputDirective]);
}());
