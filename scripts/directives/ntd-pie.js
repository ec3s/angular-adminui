'use strict';
/**
 * Created with JetBrains PhpStorm.
 * User: wangting
 * Date: 13-4-27
 * Time: 下午3:10
 */
angular.module('ntd.directives').directive('ntdPie', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var id = '#' + attrs.id;
      var data = scope[attrs.data].analysis;

      var width = attrs.pieWidth || 800,
          height = attrs.pieHeight || 300,
          radius = Math.min(width, height) / 2;

      var color = d3.scale.ordinal()
          .range(['#fdc79b', '#ee6962', '#5d96b1', '#b8d97e',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263']);

      var arc = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.value;
          });

      var svg = d3.select(id).append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

//      data.forEach(function(d) {
//        d.population = +d.population;
//      });

      var g = svg.selectAll('.arc')
          .data(pie(data))
          .enter().append('g')
          .attr('class', 'arc');

      g.append('path')
          .attr('d', arc)
          .style('fill', function(d) {
            return color(d.data.name);
          });

      g.append('text')
          .attr('transform', function(d) {
            return 'translate(' + arc.centroid(d) + ')';
          })
          .attr('dy', '.35em')
          .style('text-anchor', 'middle')
          .text(function(d) {
            return d.data.name;
          });
      var legend = svg.selectAll('.legend')
          .data(color.domain().slice().reverse())
          .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            return 'translate(0,' + i * 20 + ')';
          });

      legend.append('rect')
          .attr('x', width - 430)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', color);

      legend.append('text')
          .attr('x', width - 440)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'end')
          .text(function(d) {
            return d;
          });
    }
  };
}]);
