(function(ng) {
  'use strict';
  var rcSubmit = function($parse) {
    return {
      restrict: 'A',
      require: ['rcSubmit', '?form'],
      controller: function() {
        this.attempted = false;

        var formController = null;

        this.setAttempted = function() {
          this.attempted = true;
        };

        this.setFormController = function(controller) {
          formController = controller;
        };

        this.needsAttention = function(fieldModelController) {
          if (!formController) return false;

          if (fieldModelController) {
            return fieldModelController.$invalid &&
              (fieldModelController.$dirty || this.attempted);
          } else {
            return formController && formController.$invalid &&
              (formController.$dirty || this.attempted);
          }
        };
      },
      compile: function() {
        return {
          pre: function(scope, formElement, attributes, controllers) {

            var submitController = controllers[0];
            var formController =
              (controllers.length > 1) ? controllers[1] : null;

            submitController.setFormController(formController);

            scope.rc = scope.rc || {};
            scope.rc[attributes.name] = submitController;
          },
          post: function(scope, formElement, attributes, controllers) {

            var submitController = controllers[0];
            var formController =
              (controllers.length > 1) ? controllers[1] : null;
            var fn = $parse(attributes.rcSubmit);

            formElement.bind('submit', function(event) {
              submitController.setAttempted();
              if (!scope.$$phase) scope.$apply();

              if (!formController.$valid) return;

              scope.$apply(function() {
                fn(scope, {$event: event});
              });
            });
          }
        };
      }
    };
  };
  ng.module('ntd.directives')
    .directive('rcSubmit',
      ['$parse', rcSubmit]
    );
})(angular);
