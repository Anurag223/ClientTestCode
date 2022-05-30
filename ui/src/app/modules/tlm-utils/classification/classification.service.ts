import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FMPHelper } from 'src/Constants/helpers';
import { IClassificationAPIResponse } from './classification-model';



@Injectable({
  providedIn: 'root',
})
export class ClassificationService extends DataService {
  constructor(private _http: HttpClient, _loggerService: LoggerService) {
    super('', '', _http, _loggerService);
  }

    /**
     * We are fetching Claims according to Category in get call
     * @memberof ClassificationService
     */
    getAllAsObject(): Observable<IClassificationAPIResponse> {
        this.WriteDebugLog('ClassificationService => getAll as Iface');
        const url = `${
            FMPHelper.ApplicationSettings.epicGroupsAPIv2
            }`;
        return this.select(null, url);
    }
    /**
   * We are fetching Classification Object
   * @memberof ClassificationService
   * Ex:
   
   */
    getClassificationObject(
        page: number,
        size: number,
        sort?: string,
        include?: string,
    ): Observable<IClassificationAPIResponse> {
        super.WriteDebugLog('ClassificationBrowserService => getClassificationObject as Iface');
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

        const url = `${FMPHelper.ApplicationSettings.epicGroupsAPIv2}?${encodeURI(
            queryBuilder,
        )}`;

        return this._http.get<IClassificationAPIResponse>(url)
            .pipe(catchError(this.handleError));
    }
}
