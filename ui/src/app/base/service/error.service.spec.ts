import { ErrorService } from './error.service';

fdescribe('ErrorService', () => {
  let errorService: ErrorService;
  const queueItem = {
    errorCallbackSubject: {},
  };
  const response = {};
  const errorString = '';
  const errorTrailString = '';

  beforeEach(() => {
    errorService = new ErrorService();
  });

  it('parseTCO() should return tco number', () => {
    expect(errorService.parseTCO('111:bbb:aaa')).toEqual('aaa');
  });

  it('should execute checkQueueSize function', () => {
    spyOn(queueItem, 'errorCallbackSubject');
    errorService.checkQueueSize(queueItem);
    expect(queueItem.errorCallbackSubject).toHaveBeenCalled();
  });

  it('should execute executeGenericErrorCallback() function', () => {
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
