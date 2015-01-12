(function(ng, app) {
  'use strict';
  var placeholderDecorator = function($provide) {
    var placeholderDirective = function($delegate, $timeout) {
      var directive = $delegate[0];
      if (!directive.hasOwnProperty('link')) {
        return $delegate;
      }
      var oldLinkFn = ng.copy(directive.link);
      var linkFn;
      delete directive.link;

      directive.compile = function(elem) {
        var isInput = elem.is('input') &&
          !elem.is('input[type="file"]') &&
          !elem.is('input[type="radio"]') &&
          !elem.is('input[type="checkbox"]') &&
          !elem.is('input[type="submit"]') &&
          !elem.is('input[type="button"]');
        var isTextarea = elem.is('textarea');
        if (isInput || isTextarea) {
          var oldLinkFnStr = oldLinkFn.toString();
          oldLinkFnStr =
          oldLinkFnStr.replace(
            'setValueWithModel(orig_val);',
            'setValueWithModel(orig_val);if (ngModel) {ngModel.$setPristine();}'
          );
          eval("linkFn = " + oldLinkFnStr);
          return linkFn;
        }
      };
      return $delegate;
    };
    $provide.decorator('placeholderDirective', [
      '$delegate', '$timeout', placeholderDirective
    ]);
  };
  app.config(['$provide', placeholderDecorator]);
})(angular, angular.module('ng.shims.placeholder'));
