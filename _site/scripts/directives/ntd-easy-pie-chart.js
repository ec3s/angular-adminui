'use strict';

angular.module('ntd.directives').directive('easyPieChart', [
  '$compile',
  '$timeout',
  function($compile, $timeout) {
    return {
      restrict: 'A',
      scope: { item: '=easyPieChart' },
      replace: true,
      template: '<div class="easy-pie-chart">' +
                    '<div data-percent="{{item.percent}}">' +
                        '{{item.usage}}' +
                    '</div>' +
                    '<div class="caption">' +
                        '{{item.caption}}' +
                    '</div>' +
                '</div>',

      link: function(scope, element, attrs) {
        var colorRange = ['#08c', '#e7912a', '#bacf0b',
                          '#4ec9ce', '#ec7337', '#f377ab'];
        var lineWidth = attrs.easyPieChartLineWidth || 12,
            size = attrs.easyPieChartSize || 100,
            barColor = colorRange[scope.$parent.$index % 6] || '#08c',

            options = {
              'animate': 2000,
              'scaleColor': false,
              'lineWidth': lineWidth,
              'lineCap': 'square',
              'size': size,
              'barColor': barColor,
              'trackColor': '#e5e5e5'
            },

            render_easy_pie_chart = function() {
              $(angular.element(element.children()[0])).easyPieChart(options);
            };
          $(element).parent().addClass('easy-pie-chart-widget');
          attrs.$observe('easyPieChart', render_easy_pie_chart);
      }
    };
  }
]);
