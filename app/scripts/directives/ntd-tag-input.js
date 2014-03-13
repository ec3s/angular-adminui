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
 * version 0.2
 *
 * @author Fengming Sun <sunfengming@ec3s.com>
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
      '<span>{{tag.name}}</span>' +
      '<i data-ng-show="tagsAttribute[$index].editable"' +
      ' class="glyphicon glyphicon-pencil"' +
      ' data-ng-click="editTag($index, $event)"></i>' +
      ' <i data-ng-show="tagsAttribute[$index].deletable"' +
      ' data-ng-click="removeTag($index)"' +
      ' class="glyphicon glyphicon-remove"></i></li><li class="input-li">' +
      '<input id="{{id}}" class="form-control input-sm"' +
      ' data-ng-model="tagInput"' +
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
        var tagsAttribute = scope.tagsAttribute = [];

        var getPopHtml = function(index) {
          return '<div id="pop_' + index + '" >' +
                 '<p><input id="pop_inp_' + index + '"' +
                 ' type="text" class="form-control input-sm"/></p>' +
                 ' <button type=\"button\"' +
                 ' class=\"btn btn-primary btn-sm\">' +
                 ' 确定</button>\n<button type="button"' +
                 ' class=\"btn btn-default btn-sm\">' +
                 ' 取消</button>' +
                 '</div>';
        };

        var cancelEdit = function(index) {
          return function(e) {
            angular.element(elem.find('li')[index]).popover('destroy');
            elem.find('input').focus();
          }
        };

        var useEdit = function(index) {
          return function(e) {
            var tagName = elem.find('#pop_inp_' + index).val();
            var findIndex = indexOf(scope.tags, {'name': tagName});
            if (!unique || findIndex === -1) {
              scope.tags[index].name = tagName;
              scope.$apply();
            } else {
              angular.element(elem.find('li')[findIndex])
              .fadeTo('fast', 0.2).fadeTo('fast', 1);
            }
            angular.element(elem.find('li')[index]).popover('destroy');
            elem.find('input').focus();
          }
        };

        var closeAllPop = function() {
          elem.find('li').each(function(index, item) {
            angular.element(item).popover('destroy');
          });
        };

        var isDeletable = function(tag) {
          return angular.isUndefined(tag.deletable) || tag.deletable;
        };

        var isEditable = function(tag) {
          return !angular.isUndefined(tag.editable) && tag.editable;
        };

        var setTagAttribute = function(tag, index) {
          if (!angular.isObject(tagsAttribute[index])) {
            tagsAttribute[index] = {
              'deletable': isDeletable(tag) ? true : false,
              'editable': isEditable(tag) ? true : false
            };
          }
          delete(tag.deletable);
          delete(tag.editable);
        };

        /**
         *  检查 Tags 中的元素，补充元素属性
         */
        var unifyItemInTags = function(tags) {
          angular.forEach(tags, function(tag, index) {
            if (angular.isString(tag)) {
              tags[index] = {
                'name': tag
              };
            }
            setTagAttribute(tags[index], index);
          });
        };

        unifyItemInTags(scope.tags);

        // 查看tag 所处位置
        var indexOf = function(tags, tag) {
          if (!caseSensitive) {
            var tagName = tag.name.toLowerCase();
            var allNames = tags.map(function(tag) {
              return tag.name.toLowerCase();
            });
          }
          return allNames.indexOf(tagName);
        };

        if (!angular.isArray(scope.tags)) {
          scope.tags = [];
        }

        if (unique) {
          angular.forEach(scope.tags, function(tag) {
            if (indexOf(uniqueTags, tag) === -1) {
              uniqueTags.push(tag);
            }
          });
          scope.tags = uniqueTags;
        }

        // 删除按钮
        scope.removeTag = function(index) {
          closeAllPop();
          scope.tags.splice(index, 1);
          tagsAttribute.splice(index, 1);
        };

        scope.editTag = function(index, event) {
          event.stopPropagation();
          closeAllPop();
          angular.element(elem.find('li')[index]).popover({
            content: getPopHtml(index),
            html: true,
            placement: 'top',
            trigger: 'manual',
            title: '修改'
          });
          angular.element(elem.find('li')[index]).popover('show');
          elem.find('#pop_inp_' + index).focus()
            .bind('keypress', function(e) {
              e.preventDefault();
              if (e.keyCode == 13) {
                useEdit(index)(e);
              }
            }).val(scope.tags[index].name);
          elem.find('#pop_' + index).find('.btn-primary')
            .bind('click', useEdit(index));
            elem.find('#pop_' + index).find('.btn-default')
              .bind('click', cancelEdit(index));
          elem.find('.popover').bind('click', function(e) {
            e.stopPropagation();
          });
        };

        var addTag = function(tag) {
          scope.tags.push(tag);
          tagsAttribute.push({
            'deletable': true,
            'editable': false
          });
        };

        elem.find('input').bind('focus', function() {
          scope.isFocus = true;
          scope.$apply();
        });

        elem.find('input').bind('blur', function() {
          scope.isFocus = false;
          var oldValue = $(this).val();
          if (oldValue) {
            var tag = {
              'name': oldValue
            };
            var index = indexOf(scope.tags, tag);
            if (!unique || index === -1) {
              addTag(tag);
            } else {
              angular.element(elem.find('li')[index])
              .fadeTo('fast', 0.2).fadeTo('fast', 1);
            }
          }
          scope.tagInput = '';
          scope.$apply();
        });

        elem.bind('click', function(e) {
          closeAllPop();
          elem.find('input').focus();
        });

        // 删除前面的标签
        elem.find('input').bind('keyup', function(e) {
          // record input
          if (oldInput != scope.tagInput) {
            oldInput = scope.tagInput;
          } else if (e.keyCode == 8 && scope.tags.length > 0) {
            if (oldInput == scope.tagInput) {
              var tagAttribute = tagsAttribute[scope.tags.length - 1];
              if (tagAttribute.deletable === true) {
                scope.removeTag(scope.tags.length - 1);
                scope.$apply();
              } else {
                angular.element(elem.find('li')[scope.tags.length - 1]).stop()
                  .fadeTo('fast', 0.2).fadeTo('fast', 1);
                }
            }
          }
        });

        // 观察标签变动
        scope.$watch('tags', function(newValue, oldValue) {
          unifyItemInTags(newValue);
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
                var tag = {
                  'name': oldValue
                };
                var index = indexOf(scope.tags, tag);
                if (!unique || index === -1) {
                  addTag(tag);
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
