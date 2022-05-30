import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';
import { FMPHelper } from 'src/Constants/helpers';

@Injectable({
  providedIn: 'root',
})
export class InfluxService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }


  getDatabases(requestParams: string): Observable<any> {
    this.WriteDebugLog('InfluxService => getDatabases');
    const url = `${
        FMPHelper.ApplicationSettings.influxDBQueryAPI
          }?pretty=true&q=show databases${requestParams}`;
     
    return this.select(null, url);
    }
    createDatabase(databaseName: string): Observable<any> {
        this.WriteDebugLog('InfluxService => createDatabase');
        const url = `${
            FMPHelper.ApplicationSettings.influxDBQueryAPI
            }?pretty=true&q=create database \"${databaseName}\"`;
      
        return this.create(databaseName, url);
    }

}
