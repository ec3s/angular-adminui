/* flash message */
(function() {
  function flashService($rootScope) {
    return {
      notify: function(message, isFlash) {
        if (isFlash) {
          $rootScope.$emit('event:flashMessageEvent', message);
        } else {
          $rootScope.$emit('event:notification', message);
        }
      }
    };
  }
  angular.module('ntd.services', []).factory('flash', ['$rootScope', flashService]);
}());

(function () {
  'use strict';
  function flashMessageService($rootScope) {
    return {
      notify: function(message) {
        $rootScope.$emit('event:flashMessageEvent', message);
      }
    };
  }
  angular.module('ntd.services').factory('flashMessage', ['$rootScope', flashMessageService]);
}());
