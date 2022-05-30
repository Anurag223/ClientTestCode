import { Injectable } from '@angular/core';
import { DataService } from '../../../base/service/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoggerService } from '../../../base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from '../../../../Constants/helpers';
import { EquipmentAPIResponse, EquipmentCodeClassification, Equipment } from '../models/equipment-model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EpisodeBrowserService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    getEpisodeData(
        equipmentID: string,
        materialNumber: string,
        channelCode: string,
        channelType: string): Observable<any> {

        super.WriteDebugLog('EpisodeBrowserService => getEpisodeData');
        let queryBuilder = `?page[number]=${1}&page[size]=${1000}`;
        let sort = '-ModifiedDate'
        queryBuilder += `&sort=${sort}`;
        let encodedID = encodeURIComponent(equipmentID);
        let filterstring = '';
        if (equipmentID != null) {

         filterstring = '&filter[equipmentWkeIdList]=in:' + encodedID;
        }
        const url = `${FMPHelper.ApplicationSettings.ehcAPI}/episodes`;//+queryBuilder+filterstring;
        return super.select(null, url);
    }
    getEpisodicData(equipment: Equipment, episodeID: string, channelCode): Observable<any> {
        super.WriteDebugLog('EquipmentChannelService => getChannelList as Iface');
        let encodedID = encodeURIComponent(equipment.wellKnownEntityId);
        let url = `${FMPHelper.ApplicationSettings.ehcAPI}/equipment/${encodedID}/episodic-points/`;
        if (channelCode != null && channelCode.length > 0) {
            url = `${FMPHelper.ApplicationSettings.ehcAPI}/equipment/${encodedID}/episodic-points/${channelCode}`;
        }
        if (episodeID != null && episodeID.length > 0 && channelCode != null && channelCode.length > 0) {
            url = `${FMPHelper.ApplicationSettings.ehcAPI}/equipment/${encodedID}/episodic-points/${channelCode}?episodeID=${episodeID}`;
        }
        return super.select(null, url);
    }
    processEmotEpisode(
        episodeID: string,
        equipmentWKEID: string,
        correlationID: string): Observable<String> {

        super.WriteDebugLog('EpisodeBrowserService => processEmotEpisode');
        const url = `${FMPHelper.ApplicationSettings.ehcAvatarAPI}/ProcessEmotEpisode/`;

        let params = new HttpParams();
        params = params.set('wkeId', equipmentWKEID);
        params = params.set('episodeId', episodeID);
        params = params.set('correlationId', correlationID);
        return super.createForJson(params, url);
    }
}
