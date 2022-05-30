'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var error_service_1 = require('./error.service');
fdescribe('ErrorService', function() {
  var errorService;
  var queueItem = {
    errorCallbackSubject: {},
  };
  var response = {};
  var errorString = '';
  var errorTrailString = '';
  beforeEach(function() {
    errorService = new error_service_1.ErrorService();
  });
  it('parseTCO() should return tco number', function() {
    expect(errorService.parseTCO('111:bbb:aaa')).toEqual('aaa');
  });
  it('should execute checkQueueSize function', function() {
    spyOn(queueItem, 'errorCallbackSubject');
    errorService.checkQueueSize(queueItem);
    expect(queueItem.errorCallbackSubject).toHaveBeenCalled();
  });
  it('should execute executeGenericErrorCallback() function', function() {
    spyOn(errorService, 'parseTCO');
    spyOn(errorService, 'checkQueueSize');
    errorService.executeGenericErrorCallback(
      queueItem,
      response,
      errorString,
      errorTrailString,
    );
    expect(errorService.parseTCO).toHaveBeenCalled();
    expect(errorService.checkQueueSize).toHaveBeenCalled();
  });
});
//# sourceMappingURL=error.service.spec.js.map
