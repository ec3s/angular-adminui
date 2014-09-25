(function(ng) {
  'use strict';
  var FinderDirective = function($timeout) {
    return {
      'restrict': 'A',
      'templateUrl': 'templates/finder.html',
      'scope': {
        'source': '=',
        'ngModel': '='
      },
      'link': function(scope, elem, attrs) {
        var finder = new Finder(scope, $timeout, elem);

        /* watch for ngModel change to reselect finder */
        scope.$watch('ngModel', function(value, oldValue) {
          if (finder.isClick == false && value != oldValue) {
            finder.selectItemByValue(scope, value);
          } else {
            finder.isClick = false;
          }
        });

        /* watch for data source change to reload finder  */
        scope.$watch('source', function(value, oldValue) {
          if (value != oldValue) {
            finder = new Finder(scope, $timeout, elem);
          }
        }, true);
      }
    };
  };

  var Finder = function(scope, $timeout, elem) {
    this.dataSource = this.initData(scope.source);
    this.elem = elem;
    this.$timeout = $timeout;
    this.isClick = false;
    this.expandList = [];
    this.selectedItems = [];
    this.initialize(scope);
  };

  Finder.prototype.initialize = function(scope) {
    scope.finderList = this.getExpandList(null);
    /* select finder for initialize */
    this.selectItemByValue(scope, scope.ngModel);

    /* bind fn to view */
    scope.showChildren = ng.bind(this, this.showChildren, scope);
    scope.hasChildren = ng.bind(this, this.hasChildren);
    scope.isItemSelected = ng.bind(this, this.isItemSelected);
    scope.isLevelSelected = ng.bind(this, this.isLevelSelected);
  };

  /**
   * select item by value
   */
  Finder.prototype.selectItemByValue = function(scope, value) {
    var item = this.getItemByValue(scope.source, value);
    if (item != null) {
      var selectedItems = this.getAllSelected(item);
      ng.forEach(selectedItems, function(item) {
        this.showChildren(scope, item);
      }, this);
    } else {
      if (this.expandList.length > 1) {
        this.expandList.splice(1, this.expandList.length - 1);
      }
      this.selectedItems = [];
    }
  };

  /**
   * get item by value
   */
  Finder.prototype.getItemByValue = function(source, value) {
    var result = null;
    ng.forEach(source, function(item) {
      if (item.value == value) {
        result = item;
      }
    });
    return result;
  };

  /**
   * get expanded list while item selected
   */
  Finder.prototype.getExpandList = function(selectedItem) {
    this.selectedItems = this.getAllSelected(selectedItem);
    /* not selected anything */
    if (this.selectedItems.length <= 0) {
      this.dataSource[0] && this.expandList.push(this.dataSource[0]['/']);
    }
    return this.expandList;
  };

  /**
   * is item selected
   */
  Finder.prototype.isItemSelected = function(item, index) {
    if (this.selectedItems[index] == item) {
      return true;
    }
    return false;
  };

  /**
   * is level in actived
   */
  Finder.prototype.isLevelSelected = function(level) {
    if (this.selectedItems.length - 1 == level) {
      return true;
    }
    return false;
  };

  /**
   * show children item for selected
   */
  Finder.prototype.showChildren = function(scope, item, evt) {
    var level = this.getLevel(item);
    var childLevel = level + 1;
    var children = this.getChildren(item);

    /* remove all selected item deep more then current level */
    if (!ng.isUndefined(this.selectedItems[level])) {
      this.selectedItems.splice(level, this.selectedItems.length - level);
    }
    this.selectedItems[level] = item;
    scope.ngModel = this.selectedItems.slice(-1).pop().value;

    if (ng.isUndefined(evt)) {
      this.scrollToView(this.selectedItems.length - 1);
    } else {
      this.isClick = true;
    }

    if (this.expandList.length >= childLevel) {
      /* remove all item deep more then current child  */
      this.expandList.splice(childLevel, this.expandList.length - childLevel);
    }
    if (children != null) {
      this.expandList[childLevel] = this.getChildren(item);
    }
  };

  /**
   * scroll list to show selected item
   */
  Finder.prototype.scrollToView = function(listIndex) {
    this.$timeout(function() {
      var ul = ng.element(this.elem.find('ul')[listIndex]);
      var li = ul.find('li.selected');
      var index = ul.find('li').index(li);
      ul.scrollTop(index * li.innerHeight() - ul.innerHeight() / 2);
    }.bind(this));
  };

  /**
   * get item children
   */
  Finder.prototype.getChildren = function(item) {
    var childLevel = this.getLevel(item) + 1;
    var children = null;
    if (!ng.isUndefined(this.dataSource[childLevel])) {
      if (this.dataSource[childLevel].hasOwnProperty(this.getPath(item))) {
        children = this.dataSource[childLevel][this.getPath(item)];
      }
    }
    return children;
  };

  /**
   * has children
   */
  Finder.prototype.hasChildren = function(item) {
    return this.getChildren(item) == null ? false : true;
  };

  /**
   * init data source
   */
  Finder.prototype.initData = function(dataSource) {
    var groupedData = [];
    ng.forEach(dataSource, function(item) {
      var level = this.getLevel(item);
      var parentPath = this.getParentPath(item);
      if (ng.isUndefined(groupedData[level])) {
        groupedData[level] = {};
      }
      if (ng.isUndefined(groupedData[level][parentPath])) {
        groupedData[level][parentPath] = [];
      }
      groupedData[level][parentPath].push(item);
    }, this);
    return groupedData;
  };

  /**
   * get item level in finder data source
   */
  Finder.prototype.getLevel = function(item) {
    var path = this.getPath(item, false);
    return path.split('/').length - 1;
  };

  /**
   * get item path
   */
  Finder.prototype.getPath = function(item, startWithSlash) {
    var startWithSlash = ng.isUndefined(startWithSlash) ? true : startWithSlash;
    var path = item.path;
    /* remove last slash */
    if (path[path.length - 1] == '/') {
      path = path.substr(0, path.length - 1);
    }
    if (startWithSlash == false) {
      /* remove first slash */
      path = path.substr(1, path.length - 1);
    }
    return path;
  };

  /**
   * fint item parent
   */
  Finder.prototype.getParent = function(item) {
    var parentPath = this.getParentPath(item);
    var parentItem = null;
    var level = this.getLevel(item);
    if (level > 0) {
      ng.forEach(this.dataSource[level - 1], function(items, path) {
        if (parentPath.indexOf(path) == 0) {
          ng.forEach(items, function(item) {
            if (this.getPath(item) == parentPath) {
              parentItem = item;
            }
          }, this);
        }
      }, this);
    }
    return parentItem;
  };

  /**
   * get all parents for item, include item
   */
  Finder.prototype.getAllSelected = function(item) {
    var parents = ng.isUndefined(arguments[1]) ? [] : arguments[1];
    if (item == null) {
      return parents;
    } else {
      parents.unshift(item);
      return this.getAllSelected(this.getParent(item), parents);
    }
  };

  /**
   * get parent path
   */
  Finder.prototype.getParentPath = function(item, startWithSlash) {
    var startWithSlash = ng.isUndefined(startWithSlash) ? true : startWithSlash;
    var path = '';
    if (startWithSlash == true) {
      path = '/';
    }
    if (item === null) {
      return path;
    } else {
      var pathInfo = this.getPath(item, false).split('/');
      return path + pathInfo.slice(0, pathInfo.length - 1).join('/');
    }
  };

  ng.module('ntd.directives')
  .directive('adminuiFinder', ['$timeout', FinderDirective]);
})(angular);
