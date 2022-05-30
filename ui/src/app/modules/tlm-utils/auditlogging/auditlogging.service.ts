import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FMPHelper } from '../../../../Constants/helpers';
import * as _ from 'lodash';
import { SharedService } from 'src/app/sharedcomponents/shared.service';


@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  constructor(private _http: HttpClient,
    private sharedService: SharedService) {    
  }

  getAuditLogDetails(
    ): Observable<any> {  
      const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/a2rutilsauditlog`;
      return this._http.get(url);
    }  

 writeAuditLog(activityType: any, applicationName: any, oldValue: any, newValue: any)
  : Observable<any> {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }),
      };
    const body = {      
      activityType: activityType,
      applicationName: applicationName,
      oldValue: oldValue,
      newValue: newValue,
      createdBy: this.sharedService.userLdap
    };

    const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/a2rutilsauditlogs`;
    return this._http
    .post<any>(url, body, options)
    .pipe(
      catchError(error=>throwError(error)));    
  }
}
