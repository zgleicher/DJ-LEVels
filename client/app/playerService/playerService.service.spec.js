'use strict';

describe('Service: playerService', function () {

  // load the service's module
  beforeEach(module('levelsApp'));

  // instantiate service
  var playerService;
  beforeEach(inject(function (_playerService_) {
    playerService = _playerService_;
  }));

  it('should do something', function () {
    expect(!!playerService).toBe(true);
  });

});
