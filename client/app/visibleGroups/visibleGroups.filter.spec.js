'use strict';

describe('Filter: visibleGroups', function () {

  // load the filter's module
  beforeEach(module('levelsApp'));

  // initialize a new instance of the filter before each test
  var visibleGroups;
  beforeEach(inject(function ($filter) {
    visibleGroups = $filter('visibleGroups');
  }));

  it('should return the input prefixed with "visibleGroups filter:"', function () {
    var text = 'angularjs';
    expect(visibleGroups(text)).toBe('visibleGroups filter: ' + text);
  });

});
