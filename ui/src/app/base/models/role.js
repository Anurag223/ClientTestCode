'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var FMPRole = /** @class */ (function() {
  function FMPRole(_fmpRole) {
    if (_fmpRole) {
      this.id = _fmpRole.id;
      this.name = _fmpRole.name;
      this.desciption = _fmpRole.desciption;
      this.isActive = _fmpRole.isActive;
      this.mappedCMMSRoles = _fmpRole.mappedCMMSRoles;
      this.mappedClaims = _fmpRole.mappedClaims;
      this.cmmsRoleList = [];
      this.mappedClaimsList = [];
    }
  }
  return FMPRole;
})();
exports.FMPRole = FMPRole;
var CMMSRole = /** @class */ (function() {
  function CMMSRole(_cmmsRole) {
    this.id = _cmmsRole.id;
    this.name = _cmmsRole.name;
    this.desciption = _cmmsRole.desciption;
    this.isActive = _cmmsRole.isActive;
    this.cmmssystem = _cmmsRole.cmmssystem;
  }
  return CMMSRole;
})();
exports.CMMSRole = CMMSRole;
var Claim = /** @class */ (function() {
  function Claim(_claim) {
    this.id = _claim.id;
    this.code = _claim.code;
    this.description = _claim.description;
    this.isActive = _claim.isActive;
    this.cmmssystem = _claim.cmmssystem;
  }
  return Claim;
})();
exports.Claim = Claim;
var RoleViewModel = /** @class */ (function() {
  function RoleViewModel(_data) {
    this.data = _data;
  }
  return RoleViewModel;
})();
exports.RoleViewModel = RoleViewModel;
var RoleDataModel = /** @class */ (function() {
  function RoleDataModel() {}
  return RoleDataModel;
})();
exports.RoleDataModel = RoleDataModel;
//# sourceMappingURL=role.js.map