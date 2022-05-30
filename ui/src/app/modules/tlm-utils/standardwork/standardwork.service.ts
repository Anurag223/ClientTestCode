import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from 'src/Constants/helpers';
import { IStandardWorkAPIResponse } from './standardwork-model';
import * as _ from 'lodash';



@Injectable({
  providedIn: 'root',
})
export class StandardWorkService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    /**
     * We are fetching Claims according to Category in get call
     * @memberof StandardWorkService
     */
    getAllAsObject(): Observable<IStandardWorkAPIResponse> {
        this.WriteDebugLog('StandardWorkService => getAll as Iface');
        const url = `${
            FMPHelper.ApplicationSettings.epicGroupsAPIv2
            }`;
        return this.select(null, url);
    }
    /**
   * We are fetching StandardWork Object
   * @memberof StandardWorkService
   * Ex:
   
   */
    getStandardWorkObject(
        page: number,
        size: number,
        eqcode: string,
        process: string,
        geography: string,
        sort?: string,
        include?: string,
    ): Observable<IStandardWorkAPIResponse> {
        super.WriteDebugLog('StandardWorkBrowserService => getStandardWorkObject as Iface');
        let queryBuilder = `page[number]=${page}&page[size]=${size}&sort=-ModifiedDate`;
        var jsonOptions = {
            headers: new HttpHeaders({
                'accept': 'application/json',
                'Cache-Control': 'no-cache',
            }),
        };
        if (sort) {
            queryBuilder += `&sort=${sort}`;
        }
        if (include) {
            queryBuilder += `&include=${include}`;
        }

        let filterString = '';
        if (!_.isEmpty(eqcode)) {

            filterString = filterString + '&filter[metadata.applicableEquipment.id]=' + eqcode;
        }
        if (!_.isEmpty(process)) {
            filterString = filterString + '&filter[metadata.services.servicetypeid]=' + process;
        }
        if (!_.isEmpty(geography)) {
            filterString = filterString + '&filter[metadata.countries.name]=' + geography;
        }
        if (filterString) {
            queryBuilder += filterString;
        }

        const url = `${FMPHelper.ApplicationSettings.standardWorkBaseUrl}?${encodeURI(
            queryBuilder,
        )}`;

        return this._http.get<IStandardWorkAPIResponse>(url, jsonOptions)
            .pipe(catchError(this.handleError));
    }

    // we had to modify data service to not alter the headers ... need to address this!!!
    getStandardWorkFile(
        id: string,
    ): Observable<Blob> {
        super.WriteDebugLog('StandardWorkBrowserService => getStandardWorkFile as Iface');
 
        var fileHeaderOptions = {
            headers: new HttpHeaders({
                'accept': 'application/octet-stream',
                'Cache-Control': 'no-cache',
            }),
        };
        let httpHeaders = new HttpHeaders({
            'Accept': 'application/octet-stream'

        });



        const url = `${FMPHelper.ApplicationSettings.standardWorkBaseUrl}`+"/"+id;

        return this._http.get<Blob>(url, { headers: httpHeaders })
            .pipe(catchError(this.handleError));
    }
}
