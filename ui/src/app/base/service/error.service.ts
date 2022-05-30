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

import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Polling } from '../models/polling';
import { MateoQueueException } from '../error/exception';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errList: Array<any>;
  private errorCallbackSubject: any;

  constructor() {
    this.errList = [];
  }

  public checkQueueSize(queueItem) {
    if (
      this.errorCallbackSubject &&
      Polling.mateoQueue.size === 0 &&
      this.errList.length > 0
    ) {
      this.errorCallbackSubject.next(this.errList);
      this.errList = [];
    }
  }

  public parseTCO(demandPlanId: any) {
    return demandPlanId ? _.last(demandPlanId.split(':')) : null;
  }

  public manageGroupSubject(queueItem, errorString) {
    if (queueItem.groupSubject) {
      queueItem.groupSubject.error(errorString);
    }
  }

  public executeGenericErrorCallback(
    queueItem,
    response,
    errorString,
    errorTrailString?,
  ) {
    if (
      queueItem.errorCallbackSubject &&
      queueItem.requestType.toLowerCase() === 'patch'
    ) {
      this.errorCallbackSubject = queueItem.errorCallbackSubject;
      if (_.isObject(response)) {
        const {
          demandPlanId = '',
          errors = null,
          status = '',
          message = '',
        } = response as any;
        const tcoNumber = demandPlanId ? this.parseTCO(demandPlanId) : null;
        if (errors instanceof Array) {
          const finalErrorMessage =
            errors[0].detail +
            (tcoNumber !== null ? errorString + tcoNumber : '');
          this.errList.push(finalErrorMessage);
          this.manageGroupSubject(queueItem, errors[0].detail);
        } else if (status === 404 || status === 0) {
          this.errList.push(message);
          this.manageGroupSubject(queueItem, message);
        } else {
          const finalErrorMessage =
            errorString +
            (tcoNumber !== null ? errorTrailString + tcoNumber : '');
          this.errList.push(finalErrorMessage);
          this.manageGroupSubject(queueItem, finalErrorMessage);
        }
      } else if (!_.isObject(response)) {
        const finalErrorMessage = errorString;
        this.errList.push(finalErrorMessage);
        this.manageGroupSubject(queueItem, finalErrorMessage);
      }

      this.checkQueueSize(queueItem);
    } else if (queueItem.errorCallbackSubject) {
      const ex: MateoQueueException = new MateoQueueException(
        'ErrorService',
        'Retry count excceeded for GUID Api.',
        queueItem,
      );
      ex.parameters.set('Queue Entry', queueItem);
      queueItem.errorCallbackSubject.next(ex);
    }
  }
}