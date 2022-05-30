'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var SubSite = /** @class */ (function() {
  function SubSite(_subSite) {
    this.attribute = _subSite.attribute;
    this.name = _subSite.name;
    this.description = _subSite.description;
  }
  return SubSite;
})();
exports.SubSite = SubSite;
var BusinessView = /** @class */ (function() {
  function BusinessView(_businessView) {
    this.businessGroup = _businessView.businessGroup;
    this.code = _businessView.code;
    this.definition = _businessView.definition;
    this.longName = _businessView.longName;
    this.owner = _businessView.owner;
    this.parentCode = _businessView.parentCode;
    this.type = _businessView.type;
    this.reportName = _businessView.reportName;
  }
  return BusinessView;
})();
exports.BusinessView = BusinessView;
var Facility = /** @class */ (function() {
  function Facility(_facility) {
    this.areaCode = _facility.areaCode;
    this.facilityPhone = _facility.facilityPhone;
    this.facilityStatus = _facility.facilityStatus;
    this.facilityType = _facility.facilityType;
    this.geoMarketCode = _facility.geoMarketCode;
    this.geoSiteId = _facility.geoSiteId;
    this.geoSiteName = _facility.geoSiteName;
    this.id = _facility.id;
    this.latitude = _facility.latitude;
    this.longitude = _facility.longitude;
    this.name = _facility.name;
    this.ownerShip = _facility.ownerShip;
  }
  return Facility;
})();
exports.Facility = Facility;
var Site = /** @class */ (function() {
  function Site(_site) {
    this.code = _site.code;
    this.description = _site.description;
    this.name = _site.name;
    this.siteKey = _site.siteKey;
    this.siteType = _site.siteType;
    this.facilityId = _site.facilityId;
    this.geoMarketCode = _site.geoMarketCode;
    this.facilityName = _site.facilityName;
    this.segmentCode = _site.segmentCode;
    this.facility = _site.facility;
    this.businessView = _site.businessView;
    this.subSite = _site.subSite;
    this.createdDate = _site.createdDate;
    this.createdBy = _site.createdBy;
    this.modifiedDate = _site.modifiedDate;
    this.modifiedBy = _site.modifiedBy;
    this.activeCMMS = _site.activeCMMS;
    this.sourceSystemId = _site.sourceSystemId;
    this.sourceRecordId = _site.sourceRecordId;
  }
  return Site;
})();
exports.Site = Site;
//# sourceMappingURL=siteDetails.js.map
