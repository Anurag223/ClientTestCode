"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var LO = require("lodash");
var helpers_1 = require("../../../Constants/helpers");
var SearchFavoriteBase = /** @class */ (function () {
    function SearchFavoriteBase(_searchFavBase) {
        if (_searchFavBase) {
            this.favoriteID = _searchFavBase.favoriteID;
            this.searchFavoritesName = _searchFavBase.searchFavoritesName;
            this.isDefault = false;
        }
    }
    return SearchFavoriteBase;
}());
exports.SearchFavoriteBase = SearchFavoriteBase;
var SearchFavoriteDefaults = /** @class */ (function () {
    function SearchFavoriteDefaults(_searchFavoriteDefaults) {
        if (_searchFavoriteDefaults) {
            this.userID = _searchFavoriteDefaults.userID;
            this.applicationName = _searchFavoriteDefaults.applicationName;
            this.defaultSearchFavoriteID =
                _searchFavoriteDefaults.defaultSearchFavoriteID;
        }
    }
    return SearchFavoriteDefaults;
}());
exports.SearchFavoriteDefaults = SearchFavoriteDefaults;
var SearchFavorites = /** @class */ (function () {
    function SearchFavorites(_searchFav) {
        if (_searchFav) {
            this.favoriteID = _searchFav.favoriteID;
            this.searchFavoritesName = _searchFav.searchFavoritesName;
            this.userID = _searchFav.userID;
            this.isDefault = _searchFav.isDefault;
            this.searchCriteria = _searchFav.searchCriteria;
            this.applicationName = _searchFav.applicationName;
        }
    }
    Object.defineProperty(SearchFavorites.prototype, "isNameValid", {
        get: function () {
            return this.searchFavoritesName && this.searchFavoritesName.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    SearchFavorites.prototype.getSearchCriteriaInstance = function () {
        if (!helpers_1.FMPHelper.StringIsNullOrWhiteSpace(this.searchCriteria)) {
            var jsonString = this.searchCriteria.replace(/'/g, '"');
            return JSON.parse(jsonString);
        }
        return null;
    };
    return SearchFavorites;
}());
exports.SearchFavorites = SearchFavorites;
var FavoriteSearchDataModel = /** @class */ (function () {
    function FavoriteSearchDataModel() {
        this.searchFavoriteList = [];
    }
    FavoriteSearchDataModel.prototype.setDefaultFavorite = function (currFavorite) {
        this.searchFavoriteList.forEach(function (fav) { return (fav.isDefault = false); });
        currFavorite.isDefault = true;
    };
    return FavoriteSearchDataModel;
}());
exports.FavoriteSearchDataModel = FavoriteSearchDataModel;
var FavoriteSearchViewModel = /** @class */ (function () {
    function FavoriteSearchViewModel(_data) {
        this.data = _data;
        this.favoriteFilterNotSet = new SearchFavoriteBase({
            favoriteID: -1,
            searchFavoritesName: 'Save your search',
        });
    }
    Object.defineProperty(FavoriteSearchViewModel.prototype, "isNameValid", {
        get: function () {
            var _this = this;
            var returnValue = false;
            returnValue =
                this.favoriteFilterPopUpBound &&
                    this.favoriteFilterPopUpBound.isNameValid;
            if (returnValue) {
                var foundFavorite = LO.find(this.data.searchFavoriteList, function (fav1) {
                    return helpers_1.FMPHelper.StringEqual(fav1.searchFavoritesName, _this.favoriteFilterPopUpBound.searchFavoritesName);
                });
                if (foundFavorite) {
                    returnValue = helpers_1.FMPHelper.StringEqual(this.favoriteFilterDDLBound.searchFavoritesName, foundFavorite.searchFavoritesName);
                }
            }
            return returnValue;
        },
        enumerable: true,
        configurable: true
    });
    return FavoriteSearchViewModel;
}());
exports.FavoriteSearchViewModel = FavoriteSearchViewModel;
//# sourceMappingURL=favorite-search-filter.js.map