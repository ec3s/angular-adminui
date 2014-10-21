/* notcie */
(function(ng) {
  'use strict';

  var noticeService = function($rootScope, $timeout, $sce) {
    var exports;
    // create an array of alerts available globally
    $rootScope.alerts = [];
    $rootScope.msgObj = {
      'info': 'alert-info',
      'error': 'alert-danger',
      'success': 'alert-success',
      'warning': 'alert-warning'
    };

    function _factory(alertOptions) {
      var alert = {
        className: $rootScope.msgObj[alertOptions.state],
        msg: $sce.trustAsHtml(alertOptions.info),
        close: function() {
          return exports.closeAlert(this);
        }
      };
      $rootScope.alerts.push(alert);
      return alert;
    }

    function _addAlert(alertOptions) {
      var alert = this.factory(alertOptions), that = this;
      $timeout(function() {
        that.closeAlert(alert);
      }, 5000);
    }

    function _closeAlert(alert) {
      if ($rootScope.alerts.indexOf(alert) === -1) return false;
      return this.closeAlertByIndex($rootScope.alerts.indexOf(alert));
    }

    function _closeAlertByIndex(index) {
      return $rootScope.alerts.splice(index, 1);
    }

    exports = {
      factory: _factory,
      addAlert: _addAlert,
      closeAlert: _closeAlert,
      closeAlertByIndex: _closeAlertByIndex
    };

    return exports;
  };
  ng.module('ntd.directives').factory('noticeService',
    ['$rootScope', '$timeout', '$sce', noticeService]);
}(angular));
