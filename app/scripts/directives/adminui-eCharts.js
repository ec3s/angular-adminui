(function(ng) {
  'use strict';

  /**
   * generate directive link function
   *
   * @param {function} $http service to make ajax requests from angular
   * @param {object}   util  service to get echart
   * @param {string}   type  chart type
   */

  var getLinkFunction = function($http, util, type) {
    return function(scope, element, attrs) {
      scope.config = scope.config || {};

      var dom = element.find('div')[0],
        width, height, chart;

      function getSizes(config) {
        width = config.width || attrs.width || 320;
        height = config.height || attrs.height || 240;

        if (type === 'easyPie') {
          width = config.width || attrs.width || 150;
          height = config.height || attrs.height || 150;
        }

        dom.style.width = width + 'px';
        dom.style.height = height + 'px';
      }

      function getOptions(data, config, type) {
        // merge default config
        config = ng.extend({
          showXAxis: true,
          showYAxis: true,
          showLegend: true
        }, config);

        var grid = ng.isObject(config.grid) ? config.grid : {};

        var xAxis = ng.extend({
          orient: 'top',
          axisLine: { show: true}
        }, ng.isObject(config.xAxis) ? config.xAxis : {});

        var yAxis = ng.extend({
          type: 'value',
          orient: 'right',
          scale: true,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: function(v) {
              return util.formatKMBT(v);
            }
          }
        }, ng.isObject(config.yAxis) ? config.yAxis : {});

        // basic config
        var options = {
          title: util.getTitle(data, config, type),
          tooltip: util.getTooltip(data, config, type),
          legend: util.getLegend(data, config, type),
          toolbox:
            ng.extend({ show: false },
              ng.isObject(config.toolbox) ? config.toolbox : {}),
          xAxis:
            [ng.extend(xAxis, util.getAxisTicks(data, config, type))],
          yAxis: [yAxis],
          series: util.getSeries(data, config, type, scope),
          calculable: config.calculable
        };


        if (!config.showXAxis) {
          ng.forEach(options.xAxis, function(axis) {
            axis.axisLine = { show: false };
            axis.axisLabel = { show: false };
            axis.axisTick = { show: false };
          });
        }

        if (!config.showYAxis) {
          ng.forEach(options.yAxis, function(axis) {
            axis.axisLine = { show: false };
            axis.axisLabel = { show: false };
            axis.axisTick = { show: false };
          });
        }

        if (!config.showLegend || type === 'gauge' || type === 'easyPie') {
          delete options.legend;
        }

        if (!util.isAxisChart(type)) {
          delete options.xAxis;
          delete options.yAxis;
        }

        options.grid = grid;
        if (util.isPieChart(type)) {
          delete options.grid;
        }

        if (type === 'easyPie') {
          delete options.tooltip;
        }

        return options;
      }

      function setOptions() {
        if (!scope.data || !scope.config) {
          return;
        }

        var options;

        getSizes(scope.config);

        if (!chart) {
          chart = echarts.init(dom, scope.config.theme || util.theme());
        }

        // string type for data param is assumed to ajax datarequests
        if (ng.isString(scope.data)) {
          // show loading
          chart.showLoading({ text: scope.config.loading || '奋力加载中...' });

          // fire data request
          $http.get(scope.data).success(function(response) {
            chart.hideLoading();
            if (response.data) {
              options = getOptions(response.data, scope.config, type);
              if (scope.config.debug) {
                console.log(response);
              }
              if (scope.config.forceClear) {
                chart.clear();
              }
              chart.setOption(options);
              chart.resize();
            } else {
              throw new Error(
                'angular-echarts: no data loaded from ' + scope.data);
            }
          }).error(function() {
            chart.hideLoading();
            throw new Error(
              'angular-echarts: error loading data from ' + scope.data);
          });

          // if data is avaliable, render immediately
        } else {
          options = getOptions(scope.data, scope.config, type);
          if (type === 'scatter' || type === 'radar') {
            options = {};
            options = scope.config;
          }
          if (scope.config.debug) {
            console.log(options);
          }
          if (scope.config.forceClear) {
            chart.clear();
          }
          chart.setOption(options, true);
          chart.resize();
        }
      }

      // update when charts config changes
      scope.$watch(function() {
        return scope.config;
      }, function(value) {
        if (value) {
          setOptions();
        }
      },true);

      // update when charts data changes
      scope.$watch(function() {
        return scope.data;
      }, function(value) {
        if (value) {
          setOptions();
        }
      },true);

    };
  };
  /**
   * add directives
   */
  ng.module('angular-echarts',
      ['angular-echarts.util'])
    .directive('lineChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'line')
        };
      }])
    .directive('barChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'bar')
        };
      }])
    .directive('areaChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'area')
        };
      }])
    .directive('pieChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'pie')
        };
      }])
    .directive('donutChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'donut')
        };
      }])
    .directive('easyPieCharts',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            data: '=easyPieCharts'
          },
          link: getLinkFunction($http, util, 'easyPie')
        };
      }])
    .directive('gaugeChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'gauge')
        };
      }])
    .directive('bubbleChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'scatter')
        };
      }])
    .directive('scatterChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'scatter')
        };
      }])
    .directive('radarChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'radar')
        };
      }]);




})(angular);


