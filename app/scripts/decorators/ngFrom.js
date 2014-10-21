(function(ng, app) {
  'use strict';
  var ngFormDecorator = function($provide) {
    var ngFormDirective = function($delegate, $timeout) {
    var directive = $delegate[0];
    if (!directive.hasOwnProperty('compile')) {
      return $delegate;
    }
    var oldCompileFn = ng.copy(directive.compile);
    delete directive.compile;
    directive.compile = function(element) {
      $timeout(function() {
        var requiredDom = angular.element(element.find(':input[required]:enabled,div[required]'));
        ng.forEach(requiredDom, function(value) {
          var addRequiredDom = angular.element('<span class="ngForm-required">*</span>');
          angular.element("[for = '" + angular.element(value).attr('id') + "']").append(addRequiredDom);
        });
      },100);
      return oldCompileFn.apply(directive, arguments);
    };
    return $delegate;
  };
    $provide.decorator('ngFormDirective', [
      '$delegate', '$timeout', ngFormDirective
    ]);
    $provide.decorator('formDirective', [
      '$delegate', '$timeout', ngFormDirective
    ]);
  };
  app.config(['$provide', ngFormDecorator]);
})(angular, angular.module('ng'));
