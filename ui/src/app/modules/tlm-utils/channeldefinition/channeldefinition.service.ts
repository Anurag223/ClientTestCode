import { Injectable } from '@angular/core'; 
import { DataService } from '../../../base/service/data.service';
import { HttpClient} from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable} from 'rxjs';
import { FMPHelper } from '../../../../Constants/helpers';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelDefinitionService extends DataService {

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

//Service for making a call to API endpoint for creating global channelDefinition
createChannelDefinitions(channeldefination: any): Observable<any> {
  const url = `${FMPHelper.ApplicationSettings.ehcAPI}/channel-definitions`;
  const response = this.http.post<any>(url, channeldefination);
  return response;
} 
deleteChannelDefinition(channelcode:string):Observable<any>{
  super.WriteDebugLog('EpicConflict service => getEpicConflicts as Iface');   
    const url = `${FMPHelper.ApplicationSettings.ehcAPI}/channel-definitions/${channelcode}`;
     return this.http
    .delete(url, this.options)
    .pipe(catchError(this.handleError));
}

};


