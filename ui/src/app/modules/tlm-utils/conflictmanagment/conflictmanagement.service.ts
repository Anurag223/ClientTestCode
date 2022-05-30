import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient} from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';
import { FMPHelper } from '../../../../Constants/helpers';

@Injectable({
  providedIn: 'root'
})
export class ConflictManagementService extends DataService {

  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

  getDBMapsConflicts(
  ): Observable<any> {
    super.WriteDebugLog('EpicConflict service => getEpicConflicts as Iface');   
    const url = `${FMPHelper.ApplicationSettings.ehcAdminAPI}/epicdbmapconflictlog`;
    return super.select(null, url);
}
}
