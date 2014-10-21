(function(ng) {
  'use strict';
  var AlertAnimate = function() {
    return {
      leave: function(elem, done) {
        elem.slideUp('slow', done);
      }
    };
  };

  ng.module('ntd.directives').animation('.alert-animation',
    [AlertAnimate]);
})(angular);
