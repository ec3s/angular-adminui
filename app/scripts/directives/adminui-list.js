(function(ng, app) {
  'use strict';

  var List = function($timeout, optionsInfo, selectBox) {
    this.items = [];
    this.options = [];
    this.optionsInfo = optionsInfo;
    console.log(optionsInfo);
    this.selectBox = selectBox;
    $timeout(function() {
      ng.forEach(selectBox.children('option'), function(option) {
        var option = ng.element(option);
        this.options.push(option);
        if (option.text() !== '') {
          this.items.push({
            'text': option.text(),
            'index': option.attr('value')
          });
        }
      }, this);
    }.bind(this));
  };

  List.prototype.selectItem = function($compile, scope, index) {
    ng.forEach(this.options, function(option, optionIndex) {
      if (option.attr('value') == index) {
        if (this.optionsInfo['select'] === undefined) {
        } else {
        }
        // option.attr('selected', true);
        // $compile(this.selectBox)(scope.$parent);
      }
    }, this);
  };

  var ListDirective = function($compile, $timeout) {
    return {
      'restrict': 'AC',
      'scope': {
        'selected': '=ngModel',
        'multiple': '='
      },
      'replace': true,
      'templateUrl': 'templates/adminui-list.html',
      'link': function(scope, elem, attrs) {
        var OPTIONS_REGEXP = new RegExp(
          '^\\s*([\\s\\S]+?)(?:\\s+as\\s+([\\s\\S]+?))?(?:\\s+group' +
          '\\s+by\\s+([\\s\\S]+?))?\\s+for\\s+(?:([\\$\\w][\\$\\w]*)|' +
          '(?:\\(\\s*([\\$\\w][\\$\\w]*)\\s*,\\s*([\\$\\w][\\$\\w]*)\\s*\\)))' +
          '\\s+in\\s+([\\s\\S]+?)(?:\\s+track\\s+by\\s+([\\s\\S]+?))?$'
        );
        var options = attrs['ngOptions'];
        var optionsMatches = options.match(OPTIONS_REGEXP);
        var optionsInfo = {};
        scope.optionsModel = (scope.$parent)[optionsMatches[7]];
        if (ng.isArray(scope.optionsModel)) {
          optionsInfo = {
            'label': optionsMatches[2] ?
              optionsMatches[2] : optionsMatches[1] ,
            'select': optionsMatches[2] ?
              optionsMatches[1] : optionsMatches[2] ,
            'group': optionsMatches[3],
            'value': optionsMatches[4],
            'key': undefined,
            'tracks': optionsMatches[8]
          };
        } else if (ng.isObject(scope.optionsModel)) {
          optionsInfo = {
            'label': optionsMatches[2] ?
              optionsMatches[2] : optionsMatches[1] ,
            'select': optionsMatches[2] ?
              optionsMatches[1] : optionsMatches[2] ,
            'group': optionsMatches[3],
            'key': optionsMatches[5],
            'value': optionsMatches[6],
            'tracks': optionsMatches[8]
          };
        } else {
          throw Error('ngOption only can be used in array or object.');
        }

        var selectBox = ng.element('<select>')
        .attr('ng-options', options)
        .attr('ng-model', 'selected');
        if (scope.multiple === true) {
          selectBox.attr('multiple', true);
        }
        elem.append(selectBox);
        var list = new List(
          $timeout, optionsInfo, $compile(selectBox)(scope.$parent)
        );
        /* data binding */
        scope.listItems = list.items;
        scope.selectItem = ng.bind(list, list.selectItem, $compile, scope);
      }
    };
  };

  app.directive('adminuiList', ['$compile', '$timeout', ListDirective]);
})(angular, angular.module('ntd.directives'));
