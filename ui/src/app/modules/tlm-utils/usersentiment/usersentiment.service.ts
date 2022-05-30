/* Schlumberger Confidential
/* Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
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
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSentimentService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    /**
     * We are checking for User Sentiment
     * Call the user sentiment API with parameters APPLICATION ID and CURRENT USER ALIAS
     * @memberof UserSentimentService
     */
    checkForSurvey(ldapAlias: string): Observable<any> {
        const url = 'https://coeph001.es.slb.com/UserFeedbackAPI/api/checkUserForFeedback?strAID=2631&strUserID='+ldapAlias;
        return this.select(null, url);
    }



}