'use strict';

describe('Filter: prettyTime', function () {

  // load the filter's module
  beforeEach(module('levelsApp'));

  // initialize a new instance of the filter before each test
  var prettyTime;
  beforeEach(inject(function ($filter) {
    prettyTime = $filter('prettyTime');
  }));

  it('should return the input prefixed with "prettyTime filter:"', function () {
    var text = 'angularjs';
    expect(prettyTime(text)).toBe('prettyTime filter: ' + text);
  });

});
