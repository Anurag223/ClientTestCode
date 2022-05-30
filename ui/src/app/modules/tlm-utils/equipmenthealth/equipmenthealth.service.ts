import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from '../../../../Constants/helpers';
import * as _ from 'lodash';
import { EqRegistryPayload, EqRegistryResponse } from './models/eq-registry';
import { Equipment } from '../models/equipment-model';

@Injectable({
  providedIn: 'root',
})
export class EquipmentHealthService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    /**
 * We are fetching Channel list in get callObservable<any>
 * @memberof EquipmentHealth
 */
    getChannelList(equipment: Equipment): Observable<any> {
        super.WriteDebugLog('EquipmentHealthService => getChannelList as Iface');
        let encodedID = encodeURIComponent(equipment.wellKnownEntityId);
        const url = `${FMPHelper.ApplicationSettings.ehcAPI}/equipment/${encodedID}/channel-definitions`;
        return super.select(null, url);
    }
   /** We are fetching Channel list in get callObservable < any >
    * @memberof EquipmentHealth
    */
    getChannelData(
        equipment: Equipment,
        channelCode: string,
        channelType: string): Observable < any > {
        // USE "accept: application/vnd.influx+json" 
        super.WriteDebugLog('EquipmentHealthService => getChannelData as Iface');
        let encodedID = encodeURIComponent(equipment.wellKnownEntityId);
        const url = `${FMPHelper.ApplicationSettings.ehcAPI}/equipment/${encodedID}/channels/${channelCode}`;
        return super.select(null, url);
    }
    /**
    * Verify Equipment instance is in the registry (to change later)
    * @memberof EquipmentHealth
    */
    verifyEquipmentExistsInRegistry(equipment: Equipment): Observable<any[]> {
        super.WriteDebugLog('EquipmentHealthService => verify equipment exists in registry');
        let encodedID = encodeURIComponent(equipment.id);
        const url = `${FMPHelper.ApplicationSettings.newEquipmentAPI}${encodedID}`; // This needs to send the wkeID
        return super.select(null, url);
    }
    /**
     * @param description
     * @param serialNumber
     * @param equipmentCode
     * @param materialNumber
     */
    registerEquipmentInRegistry(
       equipment: Equipment): Observable<EqRegistryResponse> {
        super.WriteDebugLog('EquipmentHealthService => regsiter equipment in registry');
        const url = `${FMPHelper.ApplicationSettings.equipmentHealthAPI}`;   // TODO seems like we should point to another API
        let payload: EqRegistryPayload = {
            wkeId: equipment.materialNumber + ':' + equipment.sourceSystemRecordId,
            description: equipment.description,
            serialNumber: equipment.sourceSystemRecordId,
            equipmentCode: equipment.equipmentCode,
            materialNumber: equipment.materialNumber
        };
        return super.createForJson(payload, url);
    }
}
