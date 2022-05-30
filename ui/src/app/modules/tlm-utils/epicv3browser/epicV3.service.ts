import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from 'src/Constants/helpers';
import { IEpicAPIResponse } from './epic-modelV3';


@Injectable({
  providedIn: 'root',
})
export class EpicV3Service extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    /**
     * We are fetching Claims according to Category in get call
     * @memberof EpicV3Service
     */
    getAllAsObject(): Observable<IEpicAPIResponse> {
        this.WriteDebugLog('EpicService => getAll as Iface');
        const url = `${
            FMPHelper.ApplicationSettings.epicGroupsAPIv2
            }`;
        return this.select(null, url);
    }
    /**
   * We are fetching Epic Object
   * @memberof EpicV3Service
   * Ex:
   
   */
    getEpicObject(
        page: number,
        size: number,
        sort?: string,
        include?: string,      
    ): Observable<IEpicAPIResponse> {
        super.WriteDebugLog('EpicBrowserService => getEpicObject as Iface');
        let queryBuilder = `page[number]=${page}&page[size]=${size}`;

        if (sort) {
            queryBuilder += `&sort=${sort}`;
        }
        if (include) {
            queryBuilder += `&include=${include}`;
        }

        let filterString = '';
        
        if (filterString) {
            queryBuilder += filterString;
        }        
        let url=null;
               url = `${FMPHelper.ApplicationSettings.epicGroupsAPIv3}?${encodeURI(
            queryBuilder,
        )}`;
        return this._http.get<IEpicAPIResponse>(url)
            .pipe(catchError(this.handleError));
    }
}
