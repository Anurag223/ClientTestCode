import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';
import { FMPHelper } from 'src/Constants/helpers';

@Injectable({
  providedIn: 'root'
})
export class EntitlementService extends DataService {

  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

  /**
   * We are fetching Claims according to Category in get call
   * @memberof EntitlementService
   */
  getClaimsCategory(requestParams: string): Observable<any> {
    this.WriteDebugLog('EntitlementService => getClaimsCategory');
    const url = `${FMPHelper.ApplicationSettings.claimAPI}/${requestParams}`;
    return this.select(null, url);
  }

  /**
   * We are fetching Claims according to Category in get call
   * @memberof EntitlementService
   */
  getRolesAdmin(requestParams: string): Observable<any> {
    this.WriteDebugLog('EntitlementService => getRolesAdmin');
    const url = `${FMPHelper.ApplicationSettings.roleAPI}/${requestParams}`;
    return this.select(null, url);
  }

  /**
   * We are saving selected claims according to the roles
   * @memberof EntitlementService
   */
  saveSelectedClaims(requestObj: any): Observable<any> {
    const url = `${FMPHelper.ApplicationSettings.roleAPI}`;
    return this.updatepatch(requestObj, url);
  }
}
