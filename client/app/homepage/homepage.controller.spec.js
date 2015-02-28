'use strict';

describe('Controller: HomepageCtrl', function () {

  // load the controller's module
  beforeEach(module('levelsApp'));

  var HomepageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomepageCtrl = $controller('HomepageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
