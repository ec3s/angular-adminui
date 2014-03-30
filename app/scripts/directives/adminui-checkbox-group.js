(function(ng) {
  var CheckboxGroup = function() {
    return {
      restrict: 'A',
      templateUrl: 'templates/checkbox-group.html',
      scope: {
        dataSource: '=ngModel'
      },
      link: function(scope, elem, attrs) {
        /* title checkbox status  */
        scope.status = 'none';

        /* bind init func */
        scope.init = ng.bind(scope, init, elem);
        /* bind checkbox group status watcher */
        scope.watchCheckboxGroup = ng.bind(scope, watchCheckboxGroup);
        /* bind toggle checked all for title checkbox */
        scope.toggleCheckedAll = ng.bind(scope, toggleCheckedAll);

        /* init directive element */
        scope.init(elem);
        /* watch all checkbox status */
        scope.watchCheckboxGroup();
      }
    };
  };

  var watchCheckboxGroup = function() {
    this.$watch('dataSource.checkboxGroup', function(value, oldValue) {
      var status = [];
      ng.forEach(value, function(checkbox) {
        if (true == Boolean(checkbox.checked)) {
          status.push(checkbox);
        }
      });

      if (status.length > 0 &&
          status.length < this.dataSource.checkboxGroup.length) {
        this.status = 'part';
      } else if (status.length == this.dataSource.checkboxGroup.length) {
        this.status = 'all';
      } else {
        this.status = 'none';
      }
    }.bind(this), true);
  };

  var toggleCheckedAll = function() {
    this.status = this.status == 'none' ? 'all' : 'none';
    ng.forEach(this.dataSource.checkboxGroup, function(checkbox) {
      checkbox.checked = this.status == 'all' ? true : false;
    }, this);
  };

  var init = function(elem) {
    var titleCheckBox = elem.find('.dropdown-toggle>input');
    var dropMenu = elem.find('.dropdown-menu');
    titleCheckBox.bind('click', function(e) {
      e.stopPropagation();
    });
    dropMenu.bind('click', function(e) {
      e.stopPropagation();
    });
  };
  ng.module('ntd.directives')
  .directive('checkboxGroup', [CheckboxGroup]);
})(angular);

