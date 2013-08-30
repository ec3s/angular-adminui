'use strict';

describe('Directive: submenuDirective', function () {
  beforeEach(module('ec3sAdminUiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<submenu-directive></submenu-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the submenuDirective directive');
  }));
});
