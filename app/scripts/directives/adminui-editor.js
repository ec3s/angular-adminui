(function(ng) {
  'use strict';
  var adminuiEditor = function($compile) {
    return {
      restrict: "EA",
      templateUrl: "editr/test/index.html",
      scope: true,
      link: function(scope, elem, attrs) {
        $('.editr').each(function() {
          new Editr({
            el: this,
            theme: 'clouds',
            path: 'components/angular-phonecat/app'
          });
        });

        $('.editr-wrap').on('mouseover', function() {
          $(this).addClass('editr-wrap--hovered');
        });

        $('.autoselect').on('click', function() {
          $(this).select();
        });

        setTimeout(function() {
          $('.js-hinge').addClass('animated hinge');
        }, 3000);
        setTimeout(function(){
          console.info($('.editr')[0].getEl.preview.body.html());
        },1000);
      }
    };
  };

  ng.module('ntd.directives')
    .directive('adminuiEditor',
      ['$compile', adminuiEditor]
    );
})(angular);
