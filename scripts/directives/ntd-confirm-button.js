'use strict';
angular.module('ntd.directives').directive('confirmButton', [
  '$document',
  '$parse',
  function($document, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var buttonId, html, message, nope, title, yep, pos;

        buttonId = Math.floor(Math.random() * 10000000000);
        attrs.buttonId = buttonId;
        message = attrs.message || '';
        yep = attrs.yes || '确定';
        nope = attrs.no || '取消';
        title = attrs.title || '确认删除?';
        pos = attrs.position || 'top';
        html = '<div id=\"button-' + buttonId + '\">' +
                  '<span class=\"confirmbutton-msg\">' + message + '</span>' +
                  '<button type=\"button\" class=\"confirmbutton-yes btn btn-primary\">' +
                    yep +
                  '</button>\n' +
                  '<button class=\"confirmbutton-no btn\">' +
                    nope +
                  '</button>' +
                '</div>';

        element.popover({
          content: html,
          html: true,
          placement: pos,
          trigger: 'manual',
          title: title
        });

        return element.bind('click', function(e) {
          var dontBubble, pop;
          dontBubble = true;
          e.stopPropagation();

          $('[id^="button-"]').closest('.popover').hide();
          element.popover('show');
          pop = $('#button-' + buttonId);
          pop.closest('.popover').click(function(e) {
            if (dontBubble) {
              e.stopPropagation();
            }
          });

          pop.find('.confirmbutton-yes').click(function(e) {
            dontBubble = false;
            var func = $parse(attrs.confirmButton);
            func(scope);
          });

          pop.find('.confirmbutton-no').click(function(e) {
            dontBubble = false;
            $document.off('click.confirmbutton.' + buttonId);
            element.popover('hide');
          });

          $document.on('click.confirmbutton.' + buttonId,
            ':not(.popover, .popover *)',
            function() {
              $document.off('click.confirmbutton.' + buttonId);
              element.popover('hide');
            }
          );
        });
      }
    };
  }
]);
