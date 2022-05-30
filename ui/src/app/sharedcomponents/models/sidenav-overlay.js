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
var constant_1 = require("../../../Constants/constant");
var LO = require("lodash");
var helpers_1 = require("../../../Constants/helpers");
var Layout = /** @class */ (function () {
    function Layout(layout) {
        var _this = this;
        this.DisabledIndexes = [];
        this.sort = [];
        if (layout) {
            this.layoutID = layout.layoutID;
            this.layoutName = layout.layoutName;
            this.layoutType = layout.layoutType;
            this.userID = layout.userID;
            this.applicationName = layout.applicationName;
            if (layout.layoutConfigs) {
                this.layoutConfigs = [];
                layout.layoutConfigs.forEach(function (lc) {
                    return _this.layoutConfigs.push(new LayoutColumn(lc));
                });
            }
            this.group = layout.group;
            this.sort = layout.sort;
            this.filter = layout.filter;
        }
    }
    Object.defineProperty(Layout.prototype, "isDefault", {
        get: function () {
            return helpers_1.FMPHelper.StringEqual(this.userID, constant_1.FMPConstant.SystemUser);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isPublic", {
        get: function () {
            return helpers_1.FMPHelper.StringEqual(this.layoutType, LayoutTypes.Public);
        },
        enumerable: true,
        configurable: true
    });
    return Layout;
}());
exports.Layout = Layout;
var LayoutColumn = /** @class */ (function () {
    function LayoutColumn(layoutData) {
        if (layoutData) {
            this.columnId = layoutData.columnId;
            this.columnName = layoutData.columnName;
            this.fieldName = layoutData.fieldName;
            this.disabled = layoutData.disabled;
            this.isDefault = layoutData.isDefault;
            this.isLocked = layoutData.isLocked;
            this.layoutName = layoutData.layoutName;
            this.sequence = layoutData.sequence;
            this.toolTip = layoutData.toolTip;
        }
    }
    return LayoutColumn;
}());
exports.LayoutColumn = LayoutColumn;
var SideNavDataModel = /** @class */ (function () {
    function SideNavDataModel() {
        this.WorkCenterLayouts = [];
        this.PnSLayouts = [];
        this.ActivityMonitorLayouts = [];
    }
    /**
     * This method segregates and stores the layouts fetched
     * for the current user as DefaultOptions and UserOptions
     */
    SideNavDataModel.prototype.storeLayoutData = function (appName, layouts) {
        switch (appName) {
            case constant_1.FMPConstant.workCenter:
                this.WorkCenterLayouts = this.sortLayouts(layouts);
                break;
            case constant_1.FMPConstant.planandSchedule:
                this.PnSLayouts = this.sortLayouts(layouts);
                break;
            case constant_1.FMPConstant.activityMonitor:
                this.ActivityMonitorLayouts = this.sortLayouts(layouts);
                break;
            default:
                throw new Error("The appName " + appName + " is not recognized in layout mapping.");
        }
    };
    /**
     * This merthod sorts the Layouts fetched for Current user
     * It also segregates the Default Tempaltes and Custom Templates
     * It marks the First template from custom template as first if the user has any Custom templates saved
     */
    SideNavDataModel.prototype.sortLayouts = function (layouts) {
        var defaultOptions = LO.filter(layouts, function (l) { return l.isDefault; });
        var userOptions = LO.filter(layouts, function (l) { return !l.isDefault; });
        return defaultOptions.concat(userOptions);
    };
    return SideNavDataModel;
}());
exports.SideNavDataModel = SideNavDataModel;
var SideNavViewModel = /** @class */ (function () {
    function SideNavViewModel(navData) {
        this.LayoutsInContext = [];
        this.PublicLayoutsInContext = [];
        this.data = navData;
    }
    Object.defineProperty(SideNavViewModel.prototype, "hasWorkCenterLayouts", {
        get: function () {
            return this.data &&
                this.data.WorkCenterLayouts &&
                this.data.WorkCenterLayouts.length > 0
                ? true
                : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavViewModel.prototype, "isLayoutNameValid", {
        get: function () {
            var _this = this;
            var returnValue = false;
            if (this.columnOptionsBound &&
                this.columnOptionsBound.layoutName &&
                this.columnOptionsBound.layoutName.trim().length > 0 &&
                !LO.some(this.LayoutsInContext, function (l) {
                    return helpers_1.FMPHelper.StringEqual(l.layoutName, _this.columnOptionsBound.layoutName) && helpers_1.FMPHelper.StringEqual(l.userID, _this.user.ldapAlias);
                })) {
                returnValue = true;
            }
            return returnValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavViewModel.prototype, "isSavingEnabled", {
        get: function () {
            var returnValue = true;
            if (!this.columnOptionsBound.isNew) {
                returnValue = helpers_1.FMPHelper.StringEqual(this.user.ldapAlias, this.selectedLayout.userID);
            }
            returnValue =
                returnValue &&
                    this.columnOptionsBound &&
                    !this.columnOptionsBound.isDefault;
            returnValue =
                returnValue && this.columnOptionsBound.isNew
                    ? this.isLayoutNameValid
                    : returnValue;
            return returnValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavViewModel.prototype, "usersPublicFavLayouts", {
        get: function () {
            var _this = this;
            return this.LayoutsInContext.filter(function (l) { return l.isPublic && !helpers_1.FMPHelper.StringEqual(l.userID, _this.user.ldapAlias); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavViewModel.prototype, "usersAllLayouts", {
        get: function () {
            return this.LayoutsInContext.filter(function (l) {
                return !helpers_1.FMPHelper.StringEqual(l.layoutType, LayoutTypes.System) &&
                    !l.isSeperator;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavViewModel.prototype, "usersLayouts", {
        get: function () {
            var _this = this;
            return this.LayoutsInContext.filter(function (l) {
                return helpers_1.FMPHelper.StringEqual(l.userID, _this.user.ldapAlias);
            });
        },
        enumerable: true,
        configurable: true
    });
    return SideNavViewModel;
}());
exports.SideNavViewModel = SideNavViewModel;
var LayoutTypes;
(function (LayoutTypes) {
    LayoutTypes["Public"] = "Public";
    LayoutTypes["Private"] = "Private";
    LayoutTypes["System"] = "System";
})(LayoutTypes = exports.LayoutTypes || (exports.LayoutTypes = {}));
//# sourceMappingURL=sidenav-overlay.js.map