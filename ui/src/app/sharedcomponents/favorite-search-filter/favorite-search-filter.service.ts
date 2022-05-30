/* Schlumberger Private
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/base/service/data.service';
import {
  FavoriteSearchDataModel, ISearchFavorites, ISearchFavoriteBase,
  ISearchFavoriteResponse,
  ISearchFavoriteDefaults
} from 'src/app/sharedcomponents/models/favorite-search-filter';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from 'src/app/base/service/logger.service';
import { FMPHelper } from 'src/Constants/helpers';



@Injectable({
  providedIn: 'root'
})
export class FavoriteSearchFilterService extends DataService {

  public dataModel: FavoriteSearchDataModel;

  constructor(_http: HttpClient, public _loggerService: LoggerService) {
    super('FavoriteSearchFilterService', FMPHelper.ApplicationSettings.favoriteFilterAPI, _http, _loggerService);
    this.dataModel = new FavoriteSearchDataModel();
  }

  /**
   * This method load all default fav search for respective user with the help of LDAP
   *
   * @param {string} LDAP
   * @param {string} appName
   * @returns {Observable<ISearchFavoriteResponse>}
   * @memberof FavoriteSearchFilterService
   */
  selectAllFavoriteSearchFilters(LDAP: string, appName: string): Observable<ISearchFavoriteResponse> {
    this.WriteDebugLog('FavoriteSearchFilterService - selectAllFavoriteSearchFilters');
    const url = `${FMPHelper.ApplicationSettings.favoriteFilterAPI}/${LDAP}/${appName}`;
    return this.selectall<ISearchFavoriteResponse>(url);
  }

  /**
   * It gives fav search  details base of its fav search id
   * @param {number} favoriteID
   * @returns {Observable<ISearchFavorites>}
   * @memberof FavoriteSearchFilterService
   */
  selectFavoriteSearchById(favoriteID: number): Observable<ISearchFavorites> {
    this.WriteDebugLog('FavoriteSearchFilterService - selectFavoriteSearchById');
    return this.select<ISearchFavorites>(favoriteID);
  }
  /**
   * Create new fav search with respective to current user
   *
   * @param {ISearchFavorites} searchFav
   * @returns {Observable<number>}
   * @memberof FavoriteSearchFilterService
   */
  insertFavoriteSearchFilter(searchFav: ISearchFavorites): Observable<number> {
    this.WriteDebugLog('FavoriteSearchFilterService - insertFavoriteSearchFilter');
    searchFav.searchCriteria = searchFav.searchCriteria.replace(/"/g, '\'');
    return this.create<number>(searchFav);
  }
  /**
   * Update fav search with respective to current user
   *
   * @param {ISearchFavorites} searchFav
   * @returns {Observable<any>}
   * @memberof FavoriteSearchFilterService
   */
  updateFavoriteSearchFilter(searchFav: ISearchFavorites): Observable<any> {
    this.WriteDebugLog('FavoriteSearchFilterService - updateFavoriteSearchFilter');
    searchFav.searchCriteria = searchFav.searchCriteria.replace(/"/g, '\'');
    return this.update<number>(searchFav);
  }
  /**
   * Delete fav search with respective to current user
   *
   * @param {number} searchFavID
   * @returns {Observable<boolean>}
   * @memberof FavoriteSearchFilterService
   */
  deleteFavoriteSearchFilter(searchFavID: number): Observable<boolean> {
    this.WriteDebugLog('FavoriteSearchFilterService - deleteFavoriteSearchFilter');
    return this.delete<boolean>(searchFavID);
  }
  /**
   * Update default fav search with respective to current user
   *
   * @param {ISearchFavoriteDefaults} searchFavDefault
   * @returns {Observable<any>}
   * @memberof FavoriteSearchFilterService
   */
  updateFavoriteSearchDefault(searchFavDefault: ISearchFavoriteDefaults): Observable<any> {
    this.WriteDebugLog('FavoriteSearchFilterService - updateFavoriteSearchFilter');
    const url = `${FMPHelper.ApplicationSettings.favoriteFilterAPI}/SetDefaultFavorite`;
    return this.update<number>(searchFavDefault, url);
  }
  /**
   * Delete default fav search with respective to current user
   *
   * @param {string} LDAP
   * @param {string} applicationName
   * @param {number} favoriteID
   * @returns {Observable<boolean>}
   * @memberof FavoriteSearchFilterService
   */
  deleteDefaultFavorite(LDAP: string, applicationName: string, favoriteID: number): Observable<boolean> {
    this.WriteDebugLog('FavoriteSearchFilterService - deleteDefaultFavorite');
    const url = `${FMPHelper.ApplicationSettings.favoriteFilterAPI}/DeleteDefaultFavorite/${LDAP}/${applicationName}/${favoriteID}`;
    return this.delete<boolean>('', url);
  }
}
