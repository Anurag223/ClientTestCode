import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from '../../../../Constants/helpers';
import { EquipmentAPIResponse, EquipmentCodeClassification } from '../models/equipment-model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EquipmentBrowserService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

  /**
   * We are fetching Equipment Object
   * @memberof EquipmentBrowser
   * Ex:
   * http://api.dev.tlm.slb.com/api/v2/equipment?page[number]=1&page[size]=25&sort=-ModifiedDate&filter[equipmentCode]=&filter[materialNumber]&filter[serialNumber]=&filter[sourceSystemRecordId]=SBF62411A0608
   */
    getEquipmentObject(
        page: number,
        size: number,
        equipClassification: EquipmentCodeClassification,
        materialNumber: string,
        serialNumber: string,
        sort?: string,
        include?: string,
    ): Observable<EquipmentAPIResponse>
    {
        super.WriteDebugLog('EquipmentBrowserService => getEquipmentObject as Iface');
        let queryBuilder = `page[number]=${page}&page[size]=${size}`;

        if (sort) {
            queryBuilder += `&sort=${sort}`;
        }
        else {
            sort = '-ModifiedDate'
            queryBuilder += `&sort=${sort}`;
        }
        if (include) {
            queryBuilder += `&include=${include}`;
        }

        let filterString = '';
        if (!_.isEmpty(serialNumber))
        {
            // name is off...serialnumber is sourceSystemRecordId for now
            filterString = filterString + '&filter[serialNumber]=' + serialNumber;
        }
        if (!_.isEmpty(equipClassification.groupCode)) {
            filterString = filterString + '&filter[equipmentcodeclassification.groupCode]=' + equipClassification.groupCode;
        }
        if (!_.isEmpty(equipClassification.productLineCode)) {
            filterString = filterString + '&filter[equipmentCodeClassification.productLineCode]=' + equipClassification.productLineCode;
        }
        if (!_.isEmpty(equipClassification.subProductLineCode)) {
            filterString = filterString + '&filter[equipmentCodeClassification.subProductLineCode]=' + equipClassification.subProductLineCode;
        }
        if (!_.isEmpty(equipClassification.productFamilyCode)) {
            filterString = filterString + '&filter[equipmentCodeClassification.productFamilyCode]=' + equipClassification.productFamilyCode;
        }
        if (!_.isEmpty(equipClassification.emsProductLineCode)) {
            filterString = filterString + '&filter[equipmentCodeClassification.emsProductLineCode]=' + equipClassification.emsProductLineCode;
        }
        if (!_.isEmpty(equipClassification.brandCode)) {
            filterString = filterString + '&filter[equipmentCodeClassification.brandCode]=' + equipClassification.brandCode;
        }
        if (!_.isEmpty(equipClassification.equipmentCode)) {
            filterString = filterString + '&filter[equipmentCode]=' + equipClassification.equipmentCode;
        }
        if (!_.isEmpty(equipClassification.name)) {
            filterString = filterString + '&filter[equipmentCodeClassification.name]=' + equipClassification.name;
        }
        // check for material number
        if (!_.isEmpty(materialNumber)) {
            filterString = filterString + '&filter[materialNumber]=' + materialNumber;
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

}
