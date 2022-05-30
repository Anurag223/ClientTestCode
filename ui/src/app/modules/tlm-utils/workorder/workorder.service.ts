import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';

import { FMPHelper } from '../../../../Constants/helpers';
import * as _ from 'lodash';
import { EquipmentAPIResponse } from '../models/equipment-model';
import { catchError } from 'rxjs/operators';
import { WORequestStatus } from '../digitalmaint/models/progress-model';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    getWorkOrders(
        equipmentID: string): Observable<any> {

        super.WriteDebugLog('WorkOrderBrowserService => getWorkOrderData');
        let queryBuilder = `page[number]=${1}&page[size]=${1000}&sort=-ModifiedDate`;
        let sort = '-ModifiedDate'
        queryBuilder += `&sort=${sort}`;
        let encodedID = encodeURIComponent(equipmentID);
        const url = `${FMPHelper.ApplicationSettings.workOrderAPI}?${encodeURI(
            queryBuilder,
        )}`;
        return super.select(null, url);
    }
    getWorkOrdersByEquipmentWKE(
        equipmentWKEID: string): Observable<EquipmentAPIResponse> {
        super.WriteDebugLog('WorkOrderService => getWorkOrdersByEquipmentWKE as Iface');
        let queryBuilder = `page[number]=${1}&page[size]=${10}`;
        queryBuilder += `&include=${'workorders'}`;
        let sort = '-ModifiedDate'
        queryBuilder += `&sort=${sort}`;
        let filterString = '';
        if (!_.isEmpty(equipmentWKEID)) {
            // name is off...serialnumber is sourceSystemRecordId for now
            filterString = filterString + '&filter[wellKnownEntityId]=' + equipmentWKEID;
        }
        if (filterString) {
            queryBuilder += filterString;
        }

        const url = `${FMPHelper.ApplicationSettings.newEquipmentAPI}?${encodeURI(
            queryBuilder,
        )}`;

        return this._http.get<EquipmentAPIResponse>(url)
            .pipe(catchError(this.handleError));
    
    }
    getRequestStatus(
        requestTrackerID: string): Observable<WORequestStatus> {
        super.WriteDebugLog('WorkOrderService => getRequestStatus');
        const url = `${FMPHelper.ApplicationSettings.workOrderAPI}/requests/${encodeURI(
            requestTrackerID,
        )}`;
        return super.select(null, url);
    }
}
