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
//import { IEquipmentSearchFavoriteModel } from 'src/app/modules/p-n-s/models/equipmentsearch';
import * as LO from 'lodash';
import { FMPHelper } from '../../../Constants/helpers';

//export interface IFavoriteSearchFilter {
//  hasSearchCriteria(): boolean;
//  getSearchFavoriteForPersistance():
//    | IEquipmentSearchFavoriteModel
//    | IActivityMonitorSearchFavoriteModel;
//}
export interface ISearchFavoriteBase {
  favoriteID: number;
  searchFavoritesName: string;
}

export interface ISearchFavorites extends ISearchFavoriteBase {
  userID: string;
  applicationName: string;
  searchCriteria: string;
  isDefault: boolean;
}

export interface ISearchFavoriteDefaults {
  userID: string;
  applicationName: string;
  defaultSearchFavoriteID: number;
}

export interface ISearchFavoriteResponse {
  searchFavoritesBase: ISearchFavoriteBase[];
  searchFavoriteDefaults: ISearchFavoriteDefaults;
}

export class SearchFavoriteBase implements ISearchFavoriteBase {
  constructor(_searchFavBase: ISearchFavoriteBase) {
    if (_searchFavBase) {
      this.favoriteID = _searchFavBase.favoriteID;
      this.searchFavoritesName = _searchFavBase.searchFavoritesName;
      this.isDefault = false;
    }
  }
  favoriteID: number;
  searchFavoritesName: string;
  isDefault: boolean;
}

export class SearchFavoriteDefaults implements ISearchFavoriteDefaults {
  constructor(_searchFavoriteDefaults: ISearchFavoriteDefaults) {
    if (_searchFavoriteDefaults) {
      this.userID = _searchFavoriteDefaults.userID;
      this.applicationName = _searchFavoriteDefaults.applicationName;
      this.defaultSearchFavoriteID =
        _searchFavoriteDefaults.defaultSearchFavoriteID;
    }
  }
  userID: string;
  applicationName: string;
  defaultSearchFavoriteID: number;
}

export class SearchFavorites implements ISearchFavorites {
  constructor(_searchFav: ISearchFavorites) {
    if (_searchFav) {
      this.favoriteID = _searchFav.favoriteID;
      this.searchFavoritesName = _searchFav.searchFavoritesName;
      this.userID = _searchFav.userID;
      this.isDefault = _searchFav.isDefault;
      this.searchCriteria = _searchFav.searchCriteria;
      this.applicationName = _searchFav.applicationName;
    }
  }
  userID: string;
  applicationName: string;
  searchCriteria: string;
  isDefault: boolean;
  favoriteID: number;
  searchFavoritesName: string;
  isNewFilter: boolean;

  get isNameValid(): boolean {
    return this.searchFavoritesName && this.searchFavoritesName.length > 0;
  }

  getSearchCriteriaInstance() {
    if (!FMPHelper.StringIsNullOrWhiteSpace(this.searchCriteria)) {
      const jsonString: string = this.searchCriteria.replace(/'/g, '"');
      return JSON.parse(jsonString);
    }
    return null;
  }
}

export class FavoriteSearchDataModel {
  constructor() {
    this.searchFavoriteList = [];
  }
  // public searchFavoriteList: SearchFavorites[]; // SearchFavoriteBase[];
  public searchFavoriteList: SearchFavoriteBase[];

  public searchFavorites: ISearchFavorites;

  public setDefaultFavorite(currFavorite: SearchFavoriteBase) {
    this.searchFavoriteList.forEach(fav => (fav.isDefault = false));
    currFavorite.isDefault = true;
  }
}

export class FavoriteSearchViewModel {
  constructor(_data: FavoriteSearchDataModel) {
    this.data = _data;
    this.favoriteFilterNotSet = new SearchFavoriteBase({
      favoriteID: -1,
      searchFavoritesName: 'Save your search',
    });
  }
  public data: FavoriteSearchDataModel;
  public favoriteFilterNotSet: SearchFavoriteBase;
  // public isFavoriteSelected: ISearchFavoriteDefaults;
  // public searchFilterModel: EquipmentSearchFilterModel;
  public userLdap: string;
  public applicationName: string;
 // public searchModel: IFavoriteSearchFilter;
  // defaultFavoriteSearch: SearchFavorites;

  favoriteFilterDDLBound: SearchFavoriteBase;
  // favoriteSearchInContext: SearchFavoriteBase[] = [];
  favoriteFilterDetailsBound: SearchFavorites;
  favoriteFilterPopUpBound: SearchFavorites;

  get isNameValid(): boolean {
    let returnValue = false;

    returnValue =
      this.favoriteFilterPopUpBound &&
      this.favoriteFilterPopUpBound.isNameValid;

    if (returnValue) {
      const foundFavorite = LO.find<SearchFavoriteBase>(
        this.data.searchFavoriteList,
        fav1 =>
          FMPHelper.StringEqual(
            fav1.searchFavoritesName,
            this.favoriteFilterPopUpBound.searchFavoritesName,
          ),
      );
      if (foundFavorite) {
        returnValue = FMPHelper.StringEqual(
          this.favoriteFilterDDLBound.searchFavoritesName,
          foundFavorite.searchFavoritesName,
        );
      }
    }

    return returnValue;
  }

  //get isFavoriteSearchFilterValid(): boolean {
 //   return this.isNameValid && this.searchModel.hasSearchCriteria();

    // let returnValue = true;

    // returnValue = returnValue && this.favoriteFilterPopUpBound && this.searchModel.hasSearchCriteria;
    // returnValue = returnValue && this.favoriteFilterPopUpBound.isNewFilter ? this.favoriteFilterPopUpBound.isNameValid : returnValue;

    // return returnValue;
 // }

 // get defaultFavoriteFilter(): SearchFavoriteBase {
 //   return this.data.searchFavoriteList.find(sf => sf.isDefault);
 // }
}
