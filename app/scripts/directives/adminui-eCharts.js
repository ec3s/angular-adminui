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

      var dom = element.find('div')[0] || element[0],
        width, height, chart, radius, resizeTicket;

      var resize = function() {
        clearTimeout(resizeTicket);
        resizeTicket = setTimeout(function() {
            chart.resize();
        },0);
      };
      $('div[data-ng-view]').bind('resize', resize);

      function getSizes(config) {
        width = config.width || attrs.width || 320;
        height = config.height || attrs.height || 240;

        if (type === 'easyPie') {
          width = config.width || attrs.width || 150;
          height = config.height || attrs.height || 150;
        }

        if (type === 'ntdPie') {
            width = config.width || attrs.pieWidth || 800;
            height = config.height || attrs.pieHeight || 300;
            radius = Math.min(width, height) / 2;
        }
        //需要自适应的时候不能给其赋宽度
        if (!scope.config.autoResize) {
          dom.style.width = width + 'px';
        }
        dom.style.height = height + 'px';
      }

      function getOptions(data, config, type) {
        // merge default config
        config = ng.extend({
          showXAxis: true,
          showYAxis: true,
          showLegend: true
        }, config);

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

        var toolbox = {show: false};

        if (type === 'bubble') {
          var bubbleXAxis = {
            type: 'value',
            power: 1,
            splitNumber: 4,
            scale: true
          };
          xAxis = ng.extend(bubbleXAxis,
            ng.isObject(config.yAxis) ? config.yAxis : {});
          yAxis = ng.extend(bubbleXAxis,
            ng.isObject(config.yAxis) ? config.yAxis : {});
          toolbox = {
            show: true,
            feature: {
              dataZoom: {show: true},
              restore: {show: true}
            }
          };
        }
        if (type === 'scatter') {
          var scatterXAxis = {
            type: 'category',
            axisLabel: {
              formatter: function(v) {
                return '类目' + v;
              }
            },
            data: (function() {
              var list = [];
              var len = 0;
              while (len++ < data[0].data.length) {
                list.push(len);
              }
              return list;
            })()
          };
          xAxis = ng.extend(scatterXAxis, xAxis);
        }

        // basic config
        var options = {
          title: util.getTitle(data, config),
          tooltip: util.getTooltip(data, config, type),
          legend: util.getLegend(data, config, type),
          toolbox:
            ng.extend(toolbox,
              ng.isObject(config.toolbox) ? config.toolbox : {}),
          xAxis: ng.isArray(config.xAxis) ? config.xAxis :
            [ng.extend(xAxis, util.getAxisTicks(data, config, type))],
          yAxis: ng.isArray(config.yAxis) ? config.yAxis : [yAxis],
          series: util.getSeries(data, config, type, scope, radius),
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


        if (ng.isObject(config.grid)) {
          options.grid = config.grid;
        }
        if (util.isPieChart(type) || type === 'gauge' || type === 'radar') {
          delete options.xAxis;
          delete options.yAxis;
          delete options.grid;
        }

        if (util.isScatterChart(type)) {
          delete options.grid;
        }

        if (type === 'easyPie') {
          delete options.tooltip;
        }
        if (type === 'scatter') {
          options.dataZoom = ng.extend({
            show: true,
            start: 30,
            end: 70
          }, options.dataZoom);
          options.dataRange = ng.extend({
            min: 0,
            max: 100,
            orient: 'horizontal',
            y: 30,
            x: 'center',
            color: ['lightgreen', 'orange'],
            splitNumber: 5
          }, options.dataRange);
          options.animation = options.animation || false;
        }
        if (type === 'radar') {
          options.polar = [];
          ng.forEach(data, function(value, index) {
            var conf = {
              indicator: value.indicator
            };
            if (data.length > 1) {
              conf.radius = data.radius || 80;
              conf.center = data.center || [((index + 1) * 25) + '%', 200];
            }
            options.polar.push(conf);
          });
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
          if (scope.config.debug) {
            console.log(options);
          }
          if (scope.config.forceClear) {
            chart.clear();
          }
          chart.setOption(options, true);
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
          replace: true,
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
          template: '<div></div>',           replace: true,
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
          template: '<div></div>',           replace: true,
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
          template: '<div></div>',           replace: true,
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
          template: '<div></div>',           replace: true,
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'donut')
        };
      }])
    .directive('easyPieChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',           replace: true,
          scope: {
            data: '=easyPieChart'
          },
          link: getLinkFunction($http, util, 'easyPie')
        };
      }])
    .directive('ntdPie',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',           replace: true,
          scope: {
            data: '=data'
          },
          link: getLinkFunction($http, util, 'ntdPie')
        };
      }])
    .directive('gaugeChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',           replace: true,
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
          template: '<div id = "bubble"></div>',
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'bubble')
        };
      }])
    .directive('scatterChart',
      ['$http', 'util', function($http, util) {
        return {
          restrict: 'EA',
          template: '<div></div>',           replace: true,
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
          template: '<div></div>',           replace: true,
          scope: {
            config: '=config',
            data: '=data'
          },
          link: getLinkFunction($http, util, 'radar')
        };
      }]);




})(angular);


