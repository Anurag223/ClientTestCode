import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient} from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable, throwError } from 'rxjs';
import { FMPHelper } from '../../../../Constants/helpers';
import { catchError, map } from 'rxjs/operators';
import { AuditLogService } from '../auditlogging/auditlogging.service';
import { ActivityType, ApplicationName } from '../models/auditlog-model';

@Injectable({
  providedIn: 'root'
})
export class InfluxDbMappingService extends DataService {

  constructor(private _http: HttpClient, _loggerService: LoggerService,
    _auditService: AuditLogService) {
    super('', '', _http, _loggerService, _auditService);
  }

  getDbMapDetails(
  ): Observable<any> {
     
    super.WriteDebugLog('InfluxDbMapping service => getDbMapDetails as Iface');   
    const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/dbmapdetails`;
    return super.select(null, url);
}


//Service for making a call to API endpoint for creating/updating a DBMapping for the equipmentCode.
CreateDBMapForEquipment(equipmentCode: string): Observable<any> {
  const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/influxdbmapping?equipmentCode=`+equipmentCode;
  const response = 
  this.http.post(url, null).pipe(map(res => {
    super.WriteAuditLog(ActivityType.AddEquipmentCode, ApplicationName.DbMapManagement, '', equipmentCode);
  })) 
  
  return response;
} 

UpdateDbMapDetails(equipmentCode:string, isEnabled:boolean): Observable<any>{
  super.WriteDebugLog('InfluxDbMapping service => post enable disable dbmapping');
 let mapping = new Map<string,string>();
 mapping.set('equipmentCode',equipmentCode);
 mapping.set('status',isEnabled.toString());
 let querystring = super.createQueryString(mapping);
 const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/influxdbmappingstatus?${querystring}`;
 return this.http
 .post(url, null, this.options)
  .pipe(map(res => {
    super.WriteAuditLog(ActivityType.UpdateDBMapStatus, ApplicationName.DbMapManagement, 
       equipmentCode + '->' + (isEnabled? "Disabled": "Enabled"), 
        equipmentCode + '->' + (isEnabled? "Enabled": "Disabled")
        )}),   
  catchError(error => throwError(error.error)));
}
};

