import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from '../../../../Constants/helpers';
import { EquipmentAPIResponse, EquipmentCodeClassification, Equipment } from '../models/equipment-model';
import { AddSchedulerJobModel, SchedulerModel } from '../models/schedulermodel';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ScheduleradminService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }
  

//get jobs
 getSchedulerData(): Observable<any> {

  const url = `${FMPHelper.ApplicationSettings.schedulerUrl}`;
  console.log("data-service");
  return super.select(null, url);

}
//triggering job
triggerJob(dataItem:any):Observable<any>{
  let groupName=dataItem.jobContext.group;
  let jobName=dataItem.jobContext.name;
  const APIurl = `${FMPHelper.ApplicationSettings.schedulerUrl}/triggered/${​​​groupName}/${jobName}`;
  console.log("trigger service");
  console.log(APIurl);
  return this._http.post(APIurl,dataItem);
}

addSchedulerJob(cmms: string,cmmsThrottle: string, context: string,isIncremental: boolean,
  sites: string, strategy: string,cron: string, cronDescription: string, description: string,
   domainType: string,forceReplace: boolean,group: string,jobType: string,
  name: string, version: number): Observable<any> {
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }),
  };
  const body = {
    cmms: cmms,
    cmmsThrottle: cmmsThrottle,
    context: context,
    isIncremental: isIncremental,
    sites: sites,
    strategy: strategy,
    cron: cron,
    cronDescription: cronDescription,
    description: description,
    domainType: domainType,
    forceReplace: forceReplace,
    group: group,
    jobType: jobType,
    name: name,
    version: version
  };

  const url =
    FMPHelper.ApplicationSettings.addSiteBasedSchedulerJobUrl;
  return this._http
    .post<any>(url, body, options)
    .pipe(catchError(this.handleError));
}

copySchedulerJob(jobData: AddSchedulerJobModel): Observable<any> {
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }),
  };
  const body = {
    cmms: jobData.jobContext.cmms,
    cmmsThrottle: jobData.jobContext.cmmsThrottle,
    context: jobData.jobContext.context,
    isIncremental: jobData.jobContext.isIncremental,
    sites: jobData.jobContext.sites,
    strategy: jobData.jobContext.strategy,
    cron: jobData.jobContext.cron,
    cronDescription: jobData.jobContext.cronDescription,
    description: jobData.jobContext.description,
    domainType: jobData.jobContext.domainType,
    forceReplace: jobData.jobContext.forceReplace,
    group: jobData.jobContext.group,
    jobType: jobData.jobContext.jobType,
    name: jobData.jobContext.name,
    version: jobData.jobContext.version
  };

  const url =
    FMPHelper.ApplicationSettings.addSiteBasedSchedulerJobUrl;
  return this._http
    .post<any>(url, body, options)
    .pipe(catchError(this.handleError));
}

updateSchedulerJob(jobData: AddSchedulerJobModel): Observable<any> {
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'responseType': 'text'
    }),
  };
  const body = {
    cmms: jobData.jobContext.cmms,
    cmmsThrottle: jobData.jobContext.cmmsThrottle,
    context: jobData.jobContext.context,
    isIncremental: jobData.jobContext.isIncremental,
    sites: jobData.jobContext.sites,
    strategy: jobData.jobContext.strategy,
    cron: jobData.jobContext.cron,
    cronDescription: jobData.jobContext.cronDescription,
    description: jobData.jobContext.description,
    domainType: jobData.jobContext.domainType,
    forceReplace: jobData.jobContext.forceReplace,
    group: jobData.jobContext.group,
    jobType: jobData.jobContext.jobType,
    name: jobData.jobContext.name,
    version: jobData.jobContext.version
  };

  const url =
    FMPHelper.ApplicationSettings.updateSiteBasedSchedulerJobUrl+jobData.id;
  return this._http
    .put<any>(url, body, options)
    .pipe(catchError(this.handleError));
}

}
