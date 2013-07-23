'use strict';

angular.module('ntd.directives').directive('cascadeList', ['$parse',
  function($parse) {
    var $element, $tree, $scope;

    function createList(parent) {
      var parentItem = getItem(parent);
      var currItem = getItem($scope.ngModel);
      var level = parentItem ? parentItem.level + 1 : 0;
      var list = $('<ul></ul>').css('margin-left', (level * 33) + '%')
        .attr('cl-id', parent);
      for (var i in $tree) {
        var item = $tree[i];
        if (item.parent == parent) {
          var li = $('<li cl-value="' + item.value + '">' + item.text + '</li>')
            .click(onItemClick);

          if (item.children().length > 0) {
            li.addClass('has-child');
          }

          if (item.value == $scope.ngModel) {
            list.addClass('selective');
          }

          if (currItem && currItem.path.indexOf('' + item.value) > -1) {
            li.addClass('selective');
          }

          list.append(li);
        }
      }

      return list;
    }

    function onItemClick(e) {
      var item = $(e.target).addClass('selective');
      var parent = item.parent().addClass('selective');
      var parentId = item.attr('cl-value');

      // 删除下级列表
      parent.nextAll('ul').remove();

      // 取消本级的选定状态
      item.prevAll('.selective').removeClass('selective');
      item.nextAll('.selective').removeClass('selective');
      parent.prevAll('.selective').removeClass('selective');

      if (item.hasClass('has-child')) {
        var list = createList(parentId);
        $element.append(list);

        // 计算点击位置，如果超过1/3则滚动
        var pos = $element.offset().left + ($element.width() * 2 / 3);
        if (e.clientX > pos) {
          $element.scrollLeft(parent.prev().offset().left);
        }
      }
      setValue(parentId);
    }

    function getItem(id) {
      var ret = $tree.filter(function(em, idx, arr) {
        return em.value == id;
      });

      return ret[0];
    }

    function setValue(val) {
      $scope.ngModel = val;
      $scope.$apply();
    }

    function initList(val) {
      $element.html('');

      if ($tree == undefined || $tree.length == 0) {
        return;
      }

      var parent = $scope.ngModel;
      var item = getItem(parent);
      parent = item ?
        (item.children().length > 0 ? item.value : item.parent) : 0;

      do {
        $element.prepend(createList(parent));
        var item = getItem(parent);
        parent = item ? item.parent : 0;
      } while (item);

      var ul = $element.find('ul.selective');
      if (ul.length > 0) {
        var left = $element.parent().offset().left +
          ($element.parent().width() * 2 / 3);
        if (ul.offset().left > left) {
          $element.scrollLeft(ul.prev().offset().left);
        }
      }
    }

    var TreeData = function(data, options) {
      var ret = [];

      for (var i in data) {
        var item = data[i];
        var path = item[options.path].split('/').slice(1, -1);

        ret.push({
          value: item[options.value],
          text: item[options.text],
          parent: item[options.parent],
          path: path,
          level: path.length - 1,
          children: function() {
            var val = this.value;
            var son = data.filter(function(em, idx, arr) {
              return em[options.parent] == val;
            });
            return son;
          }
        });
      }
      return ret;
    };

    return {
      restrict: 'ACE',
      replace: false,
      scope: {'ngModel': '=', 'data': '='},
      link: function(scope, element, attrs) {
        $scope = scope;

        $element = $('<div class="cascade-list-inner"></div>')
          .css('width', attrs.width || '400px')
          .css('height', attrs.height || '120px');
        element.append($element).addClass('cascade-list');

        var options = {
          name: attrs.name,
          parent: attrs.parent || 'parent',
          value: attrs.value || 'id',
          text: attrs.text || 'name',
          path: attrs.path || 'path'
        };
        scope.$watch('data', function(val, old) {
          $tree = new TreeData(val, options);
          initList($tree);
        });

        scope.$watch('ngModel', function(val, old) {
          if (val != old) {
            initList();
          }
        });
      }
    };
}]);
