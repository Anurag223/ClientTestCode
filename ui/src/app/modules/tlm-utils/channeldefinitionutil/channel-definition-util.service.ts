
import { Injectable } from '@angular/core'; 
import { DataService } from '../../../base/service/data.service';
import { HttpClient} from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable} from 'rxjs';
import { FMPHelper } from '../../../../Constants/helpers';
import { channelsPerEquipmentCode } from '../models/channeldefinition.model';


@Injectable({
  providedIn: 'root'
})

export class ChannelDefinitionUtilService extends DataService{

  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

  getChannelDefinitions(pageSize:any = null
  ): Observable<any> {
    let url= `${FMPHelper.ApplicationSettings.ehcAPI}/channel-definitions`;
    super.WriteDebugLog('ChannelDefinition service => getChannelDefinitions as Iface');  
    if(pageSize != null) 
    url = encodeURI(`${url}?page[size]=${pageSize}`);
    return super.select(null, url);
}

uploadChannelsByEquipmentCode(channelsForEquipmentCode: channelsPerEquipmentCode): Observable<any> {
  let url = `${FMPHelper.ApplicationSettings.ehcAPI}/channel-definitions/bulkupdatechannels`;
  url = encodeURI(`${url}/${channelsForEquipmentCode.equipmentCode}`);
  const response = this.http.post<any>(url, channelsForEquipmentCode.channelCodes);
  return response;
}
}
