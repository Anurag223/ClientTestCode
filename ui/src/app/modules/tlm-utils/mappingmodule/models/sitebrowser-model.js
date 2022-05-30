"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WhitelistedSitesModel = /** @class */ (function () {
    function WhitelistedSitesModel(siteObj) {
        this.siteObj = siteObj;
        this.code = siteObj.code;
        this.facilityId = siteObj.facilityId;
        this.businessGroup = this.businessGroup;
        this.businessCode = this.businessCode;
        this.activeCMMS = siteObj.activeCMMS;
        this.createdBy = siteObj.createdBy;
        this.lastUpdatedDateTime = siteObj.lastUpdatedDateTime;
    }
    return WhitelistedSitesModel;
}());
exports.WhitelistedSitesModel = WhitelistedSitesModel;
//# sourceMappingURL=sitebrowser-model.js.map