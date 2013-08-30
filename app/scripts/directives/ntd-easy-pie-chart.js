/* easy pie chart */
(function() {
  'use strict';
  function easyPieChartDirective($timeout) {
    return {
      restrict: 'A',
      scope: { 
        item: '=easyPieChart'
      },
      replace: true,
      template: '<div class="easy-pie-chart-widget">' +
        '<div class="easy-pie-chart">' +
          '<div class="percentage" data-percent="{{item.percent}}">{{item.usage}}</div>' +
          '<div>{{item.caption}}</div>' +
        '</div>' +
      '</div>',

      link: function(scope, element, attrs) {
        var colorRange = [
              '#08c',
              '#e7912a',
              '#bacf0b',
              '#4ec9ce',
              '#ec7337',
              '#f377ab'
            ],

            lineWidth = attrs.easyPieChartLineWidth || 12,
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
              $('.percentage ', element).easyPieChart(options);
            };

          attrs.$observe('easyPieChart', render_easy_pie_chart);
          scope.$watch('item', function(newValue, oldValue){
            if(newValue != oldValue) {
              $('.percentage ', element)
                .data('easyPieChart')
                .update(newValue.percent);
            }
          }, true);
      }
    };
  }
  
  angular.module('ntd.directives').directive('easyPieChart', ['$timeout', easyPieChartDirective]);
}());
