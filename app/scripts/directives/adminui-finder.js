(function(ng) {
  'use strict';
  var FinderDirective = function() {
    return {
      'restrict': 'A',
      'templateUrl': 'templates/finder.html',
      'scope': {
        'source': '=',
        'ngModel': '='
      },
      'link': function(scope, elem, attrs) {
        var finder = new Finder(scope.source);

        scope.finderList = finder.getExpandList(null);

        scope.showChildren = ng.bind(finder, finder.showChildren, scope);
        scope.hasChildren = ng.bind(finder, finder.hasChildren);
        scope.isItemSelected = ng.bind(finder, finder.isItemSelected);
        scope.isLevelSelected = ng.bind(finder, finder.isLevelSelected);
      }
    };
  };

  var Finder = function(dataSource) {
    this.dataSource = this.initData(dataSource);
    this.expandList = [];
    this.selectedItems = [];
  };

  /**
   * get expanded list while item selected
   */
  Finder.prototype.getExpandList = function(selectedItem) {
    this.selectedItems = this.getAllSelected(selectedItem);
    /* not selected anything */
    if (this.selectedItems.length <= 0) {
      this.expandList.push(this.dataSource[0]['/']);
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
  Finder.prototype.showChildren = function(scope, item) {
    var childLevel = this.getLevel(item) + 1;
    var children = this.getChildren(item);
    this.selectedItems = this.getAllSelected(item);
    scope.ngModel = this.selectedItems.slice(-1).pop().value;

    if (this.expandList.length >= childLevel) {
      /* remove all item deep more then current child  */
      this.expandList.splice(childLevel, this.expandList.length - childLevel);
    }
    if (children != null) {
      this.expandList[childLevel] = this.getChildren(item);
    }
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

  ng.module('ntd.directives').directive('adminuiFinder', [FinderDirective]);
})(angular);
