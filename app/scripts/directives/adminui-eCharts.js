(function(ng) {
  'use strict';

  /**
   * generate directive link function
   *
   * @param {function} $http service to make ajax requests from angular
   * @param {object}   util  service to get echart
   * @param {string}   type  chart type
   */

  function getLinkFunction($http, util, type) {
    return function(scope, element, attrs) {
      scope.config = scope.config || {};

      var dom = element.find('div')[0],
        width, height, chart;

      function getSizes(config) {
        width = config.width || attrs.width || 320;
        height = config.height || attrs.height || 240;

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
          axisLine: { show: false }
        }, ng.isObject(config.xAxis) ? config.xAxis : {});

        var yAxis = ng.extend({
          type: 'value',
          orient: 'right',
          scale: true,
          axisLine: {
            show: false
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
          series: util.getSeries(data, config, type),
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

        if (!config.showLegend || type === 'gauge') {
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

        return options;
      }

      function setOptions() {
        if (!scope.data || !scope.config) {
          return;
        }

        var options;

        getSizes(scope.config);

        if (!chart) {
          chart = echarts.init(dom, theme());
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
  }

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

  /**
   * util services
   */
  ng.module('angular-echarts.util', []).factory('util', function() {

    function isPieChart(type) {
      return ['pie', 'donut'].indexOf(type) > -1;
    }

    function isAxisChart(type) {
      return ['line', 'bar', 'area'].indexOf(type) > -1;
    }

    /**
     * get x axis ticks from the 1st serie
     */
    function getAxisTicks(data, config, type) {
      var ticks = [];
      ng.forEach(data[0].datapoints, function(datapoint) {
        ticks.push(datapoint.x);
      });

        return {
          type: 'category',
          boundaryGap: type === 'bar',
          data: ticks
        };
    }

    /**
     * get series config
     *
     * @param {Array} data serie data
     * @param {Object} config options
     * @param {String} chart type
     */
    function getSeries(data, config, type) {
      var series = [];
      ng.forEach(data, function(serie) {
        // datapoints for line, area, bar chart
        var datapoints = [];
        ng.forEach(serie.datapoints, function(datapoint) {
          datapoints.push(datapoint.y);
        });

        var conf = {
          type: type || 'line',
          name: serie.name,
          data: datapoints
        };

        // area chart is actually line chart with special itemStyle
        if (type === 'area') {
          conf.type = 'line';
          conf.itemStyle = {
            normal: { areaStyle: { type: 'default'}}
          };
        }

        // gauge chart need many special config
        if (type === 'gauge') {
          conf = ng.extend(conf, {
            splitNumber: 10,       // 分割段数，默认为5
            axisLine: {            // 坐标轴线
              lineStyle: {       // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#228b22'],
                  [0.8, '#48b'],
                  [1, '#ff4500']
                ],
                width: 8
              }
            },
            axisTick: {            // 坐标轴小标记
              splitNumber: 10,   // 每份split细分多少段
              length: 12,        // 属性length控制线长
              lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
              }
            },
            splitLine: {           // 分隔线
              show: true,        // 默认显示，属性show控制显示与否
              length: 30,         // 属性length控制线长
              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 5
            },
            title: {
              show: true,
              offsetCenter: [0, '-40%'],       // x, y，单位px
              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
              }
            },
            detail: {
              formatter: '{value}%',
              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto',
                fontWeight: 'bolder'
              }
            }
          }, config.gauge || {});
        }

        // datapoints for pie chart and gauges are different
        if (!isAxisChart(type)) {
          conf.data = [];
          ng.forEach(serie.datapoints, function(datapoint) {
            conf.data.push({value: datapoint.y, name: datapoint.x });
          });
        }

        if (isPieChart(type)) {
          // donut charts are actually pie charts
          conf.type = 'pie';

          // pie chart need special radius, center config
          conf.center = config.center || ['40%', '50%'];
          conf.radius = config.radius || '60%';

          // donut chart require special itemStyle
          if (type === 'donut') {
            conf.radius = config.radius || ['50%', '70%'];
            conf = ng.extend(conf, {
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      fontSize: '50',
                      fontWeight: 'bold'
                    }
                  }
                }
              }
            }, config.donut || {});
          }
        }

        // if stack set to true
        if (config.stack) {
          conf.stack = 'total';
        }

        series.push(conf);
      });

      return series;
    }

    /**
     * get legends from data series
     */
    function getLegend(data, config, type) {
      var legend = { data: []};
      if (isPieChart(type)) {
        ng.forEach(data[0].datapoints, function(datapoint) {
          legend.data.push(datapoint.x);
        });
        legend.orient = 'verticle';
        legend.x = 'right';
        legend.y = 'center';

      } else {
        ng.forEach(data, function(serie) {
          legend.data.push(serie.name);
        });
        legend.orient = 'verticle';
        legend.x = 52;
        legend.y = config.subtitle ? 54 : 30;
      }

      return ng.extend(legend, config.legend || {});
    }

    /**
     * get tooltip config
     */
    function getTooltip(data, config, type) {
      var tooltip = {};

      tooltip.trigger = 'item';
      if (type === 'pie') {
        tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
      }

      return ng.extend(tooltip,
        ng.isObject(config.tooltip) ? config.tooltip : {});
    }

    function getTitle(data, config, type) {
      if (ng.isObject(config.title)) {
        return config.title;
      }

      return isPieChart(type) ? null : {
        text: config.title,
        subtext: config.subtitle || '',
        x: 50
      };
    }

    function formatKMBT(y, formatter) {
      if (!formatter) {
        formatter = function(v) {
          return Math.round(v * 100) / 100;
        };
      }
      y = Math.abs(y);
      if (y >= 1000000000000) {
        return formatter(y / 1000000000000) + 'T';
      }
      else if (y >= 1000000000) {
        return formatter(y / 1000000000) + 'B';
      }
      else if (y >= 1000000) {
        return formatter(y / 1000000) + 'M';
      }
      else if (y >= 1000) {
        return formatter(y / 1000) + 'K';
      }
      else if (y < 1 && y > 0) {
        return formatter(y);
      }
      else if (y === 0) {
        return '';
      }
      else {
        return formatter(y);
      }
    }

    return {
      isPieChart: isPieChart,
      isAxisChart: isAxisChart,
      getAxisTicks: getAxisTicks,
      getSeries: getSeries,
      getLegend: getLegend,
      getTooltip: getTooltip,
      getTitle: getTitle,
      formatKMBT: formatKMBT
    };

  });

  var theme = function() {
    return {
      // 默认色板
      color: [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
      ],

      // 图表标题
      title: {
        itemGap: 8,
        textStyle: {
          fontWeight: 'normal',
          color: '#008acd'          // 主标题文字颜色
        }
      },

      // 图例
      legend: {
        itemGap: 8
      },

      // 值域
      dataRange: {
        itemWidth: 15,
        //color:['#1e90ff','#afeeee']
        color: ['#2ec7c9', '#b6a2de']
      },

      toolbox: {
        color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
        effectiveColor: '#ff4500',
        itemGap: 8
      },

      // 提示框
      tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
          lineStyle: {          // 直线指示器样式设置
            color: '#008acd',
            type: 'dashed',
            width: 1
          },
          crossStyle: {
            color: '#008acd',
            width: 1
          },
          shadowStyle: {                     // 阴影指示器样式设置
            color: 'rgba(200,200,200,0.2)'
          }
        }
      },

      // 区域缩放控制器
      dataZoom: {
        dataBackgroundColor: '#efefff',            // 数据背景颜色
        fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
        handleColor: '#008acd'    // 手柄颜色
      },

      // 网格
      grid: {
        borderColor: '#eee'
      },

      // 类目轴
      categoryAxis: {
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            color: '#008acd',
            width: 1
          }
        },
        axisLabel: {            // label
          skipFirst: true,
          margin: 3,
          textStyle: {
            color: '#999999'
          }
        },
        axisTick: {            // 坐标轴线
          show: false,
          lineStyle: {       // 属性lineStyle控制线条样式
            color: '#008acd',
            width: 1
          }
        },
        splitLine: {           // 分隔线
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: ['#eee']
          }
        }
      },

      // 数值型坐标轴默认参数
      valueAxis: {
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            color: '#008acd',
            width: 1
          }
        },
        axisLabel: {            // label
          skipFirst: true,
          margin: 3,
          textStyle: {
            color: '#999999'
          }
        },
        axisTick: {            // 坐标轴线
          show: false,
          lineStyle: {       // 属性lineStyle控制线条样式
            color: '#008acd',
            width: 1
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
          }
        },
        splitLine: {           // 分隔线
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: ['#eee']
          }
        }
      },

      polar: {
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            color: '#ddd'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.2)']
          }
        },
        splitLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },

      timeline: {
        lineStyle: {
          color: '#008acd'
        },
        controlStyle: {
          normal: { color: '#008acd'},
          emphasis: { color: '#008acd'}
        },
        symbol: 'emptyCircle',
        symbolSize: 3
      },

      // 柱形图默认参数
      bar: {
        itemStyle: {
          normal: {
            borderRadius: 5
          },
          emphasis: {
            borderRadius: 5
          }
        }
      },

      // 折线图默认参数
      line: {
        smooth: false,
        symbol: 'circle',   // 拐点图形类型
        symbolSize: 3       // 拐点图形大小
      },

      // K线图默认参数
      k: {
        itemStyle: {
          normal: {
            color: '#d87a80',       // 阳线填充颜色
            color0: '#2ec7c9',      // 阴线填充颜色
            lineStyle: {
              width: 1,
              color: '#d87a80',   // 阳线边框颜色
              color0: '#2ec7c9'   // 阴线边框颜色
            }
          }
        }
      },

      // 散点图默认参数
      scatter: {
        symbol: 'circle',    // 图形类型
        symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
      },

      // 雷达图默认参数
      radar: {
        symbol: 'emptyCircle',    // 图形类型
        symbolSize: 3
        //symbol: null,         // 拐点图形类型
        //symbolRotate: null,  // 图形旋转控制
      },

      map: {
        itemStyle: {
          normal: {
            areaStyle: {
              color: '#ddd'
            },
            label: {
              textStyle: {
                color: '#d87a80'
              }
            }
          },
          emphasis: {                 // 也是选中样式
            areaStyle: {
              color: '#fe994e'
            },
            label: {
              textStyle: {
                color: 'rgb(100,0,0)'
              }
            }
          }
        }
      },

      force: {
        itemStyle: {
          normal: {
            linkStyle: {
              strokeColor: '#1e90ff'
            }
          }
        }
      },

      chord: {
        padding: 4,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,
              color: 'rgba(128, 128, 128, 0.5)'
            },
            chordStyle: {
              lineStyle: {
                width: 1,
                color: 'rgba(128, 128, 128, 0.5)'
              }
            }
          },
          emphasis: {
            lineStyle: {
              width: 1,
              color: 'rgba(128, 128, 128, 0.5)'
            },
            chordStyle: {
              lineStyle: {
                width: 1,
                color: 'rgba(128, 128, 128, 0.5)'
              }
            }
          }
        }
      },

      gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {            // 坐标轴线
          show: true,        // 默认显示，属性show控制显示与否
          lineStyle: {       // 属性lineStyle控制线条样式
            color: [[0.2, '#2ec7c9'], [0.8, '#5ab1ef'], [1, '#d87a80']],
            width: 10
          }
        },
        axisTick: {            // 坐标轴小标记
          splitNumber: 10,   // 每份split细分多少段
          length: 15,        // 属性length控制线长
          lineStyle: {       // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
          textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: 'auto'
          }
        },
        splitLine: {           // 分隔线
          length: 22,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        pointer: {
          width: 5,
          color: 'auto'
        },
        title: {
          textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: '#333'
          }
        },
        detail: {
          textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: 'auto'
          }
        }
      },

      textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
      }
    };
  };

})(angular);


