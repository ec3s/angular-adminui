/**
 * ntd chosen directive
 *
 * attributies:
 *  data-disable-search-threshold - int
 *  当大于设置条数时显示搜索
 *  data-on-search-promise - fn
 *  当搜索的时候回调函数, 要求返回一个promise
 *  data-options-node - string
 *  返回结果中option 所处的节点
 *  data-allow-single-deselect - bool
 *  是否允许清空选中项目
 *
 * multiple 模式下 autocomplete 完成 beta
 *
 * @author Fengming Sun<sunfengming@ec3s.com>
 */
(function(app, ng) {
  'use strict';
  var Chosen = function($parse, $timeout) {
    return {
      restrict: 'AC',
      link: function(scope, elem, attrs) {
        var ngOptions = attrs.ngOptions || null;
        var ngModelName = attrs.ngModel || null;
        var onSearch = attrs.onSearchPromise || null;
        var optionsNode = attrs.optionsNode || null;
        var multiple = attrs.multiple || null;
        var oldSearch = '';
        var initOptions;
        var disableSearchThreshold = attrs.disableSearchThreshold || 0;
        var allowSingleDeselect = attrs.allowSingleDeselect || false;
        allowSingleDeselect = allowSingleDeselect == 'true' ? true : false;

        // init chosen
        var options = {
          disable_search_threshold: disableSearchThreshold
        };
        var chosenEl = elem.chosen(options);
        var chosen = chosenEl.data('chosen');
        // fix for responsive
        chosen.container.css('max-width', chosenEl.css('width'));
        var selected_options = {};
        var searchTxt = scope.$new(false);

        if (onSearch) {
          // 不进入匹配模式
          chosen.winnow_results = function() {
            this.no_results_clear();
            var searchText = this.get_search_text();
            var results_data = this.results_data;
            var option_number = 0;

            for (var i = 0; i < results_data.length; i++) {
              var option = results_data[i];
              if (!option.empty) {
                option_number++;
                // 永远可被匹配
                option.search_match = true;
                option.search_text = option.group ? option.label : option.html;
              }
            }

            // 按照有效选项数量判断现实
            if (option_number <= 0) {
              this.update_results_content('');
              this.result_clear_highlight();
              return this.no_results(searchText);
            } else {
              this.update_results_content(this.results_option_build());
              return this.winnow_results_set_highlight();
            }
          };

          // 搜索模式时, 刷新chosen 不清空搜索框内容且
          chosen.show_search_field_default = function() {
            if (this.is_multiple && this.choices_count() < 1 &&
              !this.active_field) {
              this.search_field.val(this.default_text);
              return this.search_field.addClass('default');
            } else {
              return this.search_field.removeClass('default');
            }
          };
        }

        // reset allow single deselect
        chosen.allow_single_deselect = allowSingleDeselect;

        // watch for ng-options change
        if (ngOptions) {
          var optionsModelName = ngOptions.split(' ').pop();
          var optionsModelGetter = $parse(optionsModelName);
          var optionsModelSetter = optionsModelGetter.assign;
          scope.$watch(optionsModelName, function(newValue, oldValue) {
            chosenEl.trigger('liszt:data_loaded', {
              options: newValue,
              optionsModelName: optionsModelName
            });
          }, true);
        }

        // watch for ng-model change
        if (ngModelName) {
          scope.$watch(ngModelName, function(newValue, oldValue) {
            // if multiple chosen
            if (multiple) {
              ng.forEach(newValue, function(value) {
                if (!selected_options[value]) {
                  ng.forEach(optionsModelGetter(scope), function(item, index) {
                    if (item.id == value) {
                      selected_options[value] = optionsModelGetter(
                        scope
                      )[index];
                    }
                  });
                }
              });
            }
            if (newValue !== oldValue) {
              elem.trigger('liszt:updated');
            }
          }, true);
        }

        //reselect
        chosenEl.bind('liszt:hiding_dropdown', function(e) {
          if (!chosen.active_field && ng.isArray(initOptions)) {
            optionsModelSetter(scope, initOptions);
            searchTxt.$search = '';
            searchTxt.$apply();
            $timeout(function() {
              chosenEl.trigger('liszt:updated');
              chosen.search_field.val(searchTxt.$search);
            });
          } else if (chosen.active_field) {
            initOptions = optionsModelGetter(scope);
          }
        });

        // set chosen object
        chosenEl.bind('liszt:showing_dropdown', function(e, data) {
          if (onSearch) {
            if (!searchTxt.$search) {
              $timeout(function() {
                chosen.search_results.find('.no-results').text('请输入关键字...');
              });
              return;
            }
            // if single then set search field
            if (!multiple) {
              chosen.search_field.val(searchTxt.$search);
            }
            chosenEl.trigger('liszt:load_data', {
              onSearch: onSearch,
              optionsModelName: optionsModelName,
              needRecord: true
            });
          }
        });

        // load options data
        chosenEl.bind('liszt:load_data', function(e, data) {
          var promise = searchTxt.$eval(data.onSearch);
          // add loading pic
          chosen.search_field.addClass('loading');
          // add loading tip
          chosen.search_results.find('.no-results').text('加载中...');
          promise.then(
            function(result) {
              var options = [];
              if (optionsNode) {
                options = result[optionsNode];
              } else {
                options = result;
              }
              if (!ng.isArray(options)) {
                options = [];
              }
              if (data.needRecord && !initOptions) {
                initOptions = options;
              }
              chosenEl.trigger('liszt:data_loaded', {
                options: options,
                optionsModelName: data.optionsModelName
              });
            }
          );
        });

        // options data loaded
        chosenEl.bind('liszt:data_loaded', function(e, data) {
          if (onSearch) {
            // remove loading pic
            chosen.search_field.removeClass('loading');
            // load new options
            if (ng.isArray(data.options) && data.options.length > 0) {
              if (!initOptions) {
                initOptions = data.options;
              }
              optionsModelSetter(scope, data.options);
            } else {
              // show no results tip
              optionsModelSetter(scope, []);
            }
            if (multiple) {
              // concat selected options into loaded options
              ng.forEach(selected_options, function(selectedOption) {
                var hasOption = false;
                ng.forEach(optionsModelGetter(scope), function(option) {
                  if (option.id == selectedOption.id) {
                    hasOption = true;
                    return;
                  }
                });
                if (!hasOption) {
                  var options = optionsModelGetter(scope);
                  options.push(selectedOption);
                  if (ng.isArray(options)) {
                    optionsModelSetter(scope, options);
                  }
                }
              });
            }
          }
          // refresh chosen when options loaded
          $timeout(function() {
            chosenEl.trigger('liszt:updated');
            if (!searchTxt.$search) {
              chosen.search_results.find('.no-results').text('请输入关键字...');
            }
          });
        });

        // get new option list
        if (onSearch && optionsModelName) {
          // if chosen.search_field changed, callback onSearch func
          chosen.search_field.bind('keyup', function(e) {
            if (chosen && chosen.results_showing) {
              searchTxt.$search = chosen.get_search_text();
              if (oldSearch != searchTxt.$search) {
                oldSearch = searchTxt.$search;
                chosenEl.trigger('liszt:load_data', {
                  onSearch: onSearch,
                  optionsModelName: optionsModelName
                });
              }
            }
          });
        }

        // refresh the option list when chosen changed
        chosenEl.change(function(e) {
          elem.trigger('liszt:updated');
        });

      }
    };
  };

  var Linkage = function($parse) {
    return {
      restrict: 'AC',
      template: '<span><span' +
      ' data-ng-repeat="linkage in linkages">' +
      ' <select data-ntd-chosen' +
      ' data-placeholder="请选择"' +
      ' data-disable-search-threshold="10"' +
      ' data-ng-change="change($index)"' +
      ' data-ng-model="values[$index]"' +
      ' data-allow-single-deselect="true"' +
      ' data-ng-options="option as option.name' +
      ' for option in linkage">' +
      ' <option value=""></option>' +
      '</select></span></span>',
      scope: {
        source: '=',
        ngModel: '='
      },
      link: function(scope, elem, attrs) {
        var baseLevels;
        scope.$watch('source', function(value, oldValue) {
          if (!ng.isArray(scope.ngModel)) {
            scope.ngModel = [];
          }
          initOptions();
          changeSelect();
        });

        var initOptions = function() {
          baseLevels = [];
          scope.values = [];
          scope.linkages = [];
          ng.forEach(scope.source, function(item) {
            baseLevels.push(item);
          });
          scope.linkages.push(baseLevels);
        };

        var changeSelect = function() {
          if (scope.ngModel.length > 0) {
            ng.forEach(scope.ngModel, function(id, index) {
              ng.forEach(scope.linkages[index], function(item) {
                if (item.id == id) {
                  scope.values[index] = item;
                  scope.change(index);
                }
              });
            });
          } else {
            scope.values[0] = '';
            scope.change(0);
          }
        };

        scope.change = function(index) {
          var tmpLevels = [];
          var level = scope.linkages.length - 1;
          var offset = scope.values[index];
          var values = [];
          if (!offset) {
            scope.linkages.splice(index + 1, level - index);
            scope.values.splice(index + 1, level - index);
          } else {
            if (offset.children) {
              ng.forEach(offset.children, function(item) {
                tmpLevels.push(item);
              });
            }
            if (level <= index && tmpLevels.length > 0) {
              scope.linkages.push(tmpLevels);
            } else if (index < level) {
              scope.linkages.splice(index + 1, level - index);
              scope.values.splice(index + 1, level - index);
              if (tmpLevels.length > 0) {
                scope.linkages[index + 1] = tmpLevels;
              }
            }
          }
          $(scope.values).each(function(index, item) {
            if (!!item == true && !!item.id == true) {
              values.push(item.id);
            }
          });
          scope.ngModel = values;
        };
      }
    };
  };

  app.directive('ntdChosen', ['$parse', '$timeout', Chosen]);
  app.directive('ntdLinkage', ['$parse', Linkage]);
})(angular.module('ntd.directives'), angular);
