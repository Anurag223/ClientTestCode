/* Schlumberger Private
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Polling } from 'src/app/base/models/polling';
import {
  MateoQueue,
  MateoQueueStatus,
  MateoQueueType,
} from 'src/app/base/models/mateoQueue';
import {
  LoggerService,
  DebugLog,
  InfoLog,
  ErrorLog,
  WarningLog,
} from 'src/app/base/service/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { AppTranslateService } from 'src/app/app.translate.service';
import { ErrorService } from './error.service';
import { DataService } from './data.service';
import { ApplicationException } from '../error/exception';

@Injectable({
  providedIn: 'root',
})
export class MateoApiServiceHandle extends DataService {
  private language = 'en';
  private tcoErrorData;

  constructor(
    private _httpclient: HttpClient,
    public _loggerService: LoggerService,
    private translate: TranslateService,
    private appTranslateService: AppTranslateService,
    private errorService: ErrorService,
  ) {
    super('MateoApiServiceHandle', '', _httpclient, _loggerService);
    this.language = this.appTranslateService.getCurrentLanguge();
    this.appTranslateService.changeDefaultLanguage(this.language);
    this.translate.get('CONTEXTHELP.ACTIVITYMONITOR.ERROR').subscribe(res => {
      this.tcoErrorData = res;
    });
  }

  public HandleMateoGet<T>(queue: MateoQueue<T>) {
    queue.requestType = MateoQueueType.GET;
    Polling.addQueue(queue);
    queue.apiurl = this.CheckForMockDataOverride(queue.apiurl);
    return this._httpclient
      .get<any>(queue.apiurl, {
        observe: 'response',
        headers: new HttpHeaders().set('need-cache', String(!!queue.needCache)),
      })
      .pipe(
        map(response => {
          if (response.status === 200) {
            queue.status = MateoQueueStatus.SUCCESS;
            Polling.RemoveQueue(queue.apiurl);
            if (queue.callbackSubject) {
              queue.callbackSubject.next(response.body);
            }

            this.errorService.checkQueueSize(queue);
          }
        }),
        catchError(error => {
          queue.status = MateoQueueStatus.FAILED;
          Polling.RemoveQueue(queue.apiurl);
          if (queue.errorCallbackSubject) {
            const ex: ApplicationException = new ApplicationException(
              this.serviceName,
              this.tcoErrorData.MATEOAPINOTFOUND,
              error,
            );
            ex.parameters.set('Mateo Queue', queue);
            this.WriteErrorLog(ex.errorMessage, ex);
            queue.errorCallbackSubject.next(ex);
          }
          return this.handleError(error);
        }),
      )
      .subscribe(response => {
        // Do Nothing
      });
  }

  public HandleMateoPatch<T, U>(queue: MateoQueue<T>, body: U) {
    queue.requestType = MateoQueueType.PATCH;
    Polling.addQueue(queue);
    return this._httpclient
      .patch<any>(queue.apiurl, body, { observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            queue.status = MateoQueueStatus.SUCCESS;
            Polling.RemoveQueue(queue.apiurl);
            if (queue.callbackSubject) {
              queue.callbackSubject.next(response.body);
            }
            this.errorService.checkQueueSize(queue);
          }
        }),
        catchError(error => {
          queue.status = MateoQueueStatus.FAILED;
          Polling.RemoveQueue(queue.apiurl);
          this.errorService.executeGenericErrorCallback(
            queue,
            error,
            this.tcoErrorData.TCOERROR,
          );
          return this.handleError(error);
        }),
      )
      .subscribe(response => {
        // Do Nothing
      });
  }
}