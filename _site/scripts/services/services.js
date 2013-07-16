angular.module('ntd.services', []).factory('flash', ['$rootScope', function($rootScope) {
  return {
    notify: function(message) {
      $rootScope.$emit('event:notification', message);
    }
  };
}]);