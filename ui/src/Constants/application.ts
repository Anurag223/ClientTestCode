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
export enum ApplicationEnvironments {
  LOCAL = 'LOCAL',
  DEV = 'DEVELOPMENT',
  DEMO = 'DEMO',
  PROD = 'PRODUCTION',
  QA = 'QA',
}

export enum LogLevel {
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  ConsoleOnly = 5,
  None = 6,
}

export interface IBaseEnvironmentSettings {
  // Enable Mock Data useage
  usemockdata: boolean;
  // FMP Application
  environment: ApplicationEnvironments;
  // FMP Log Level
  logLevel: LogLevel;
  // Mateo Version
  mateoVersionNumber: string;
  // Mateo Apis Base url
  mateoBaseUrl: string;

  // FMP API Base Url
  fmpBaseUrl: string;
  // QTrack Deep Link Base Url
  qtrackBaseUrl: string;
  // QTrack Report Base Url
  qtrackReportBaseUrl: string;
  // Pre Shipping Manifest Base Url
  preShippingManifestBaseUrl: string;
  // SLB directory Base Url
  directoryUrl: string;
  // Qtrack Application Base Url
  qtrackApplicationBaseUrl: string;
  // Base url for TCO Link on Activity Monitor.
  // Needed separate as it does not follow standard pattern
  qtrackTCOBaseUrl: string;
  mtAssetNumberBaseUrl: string;

  maximoBaseUrl: string;

    // InfluxDB
    influxDBBaseUrl: string;

    // new Equipment base (different until backend apis are consolidated.
    newEquipmentBaseUrl: string;

    // EHC.API V2 as a replacement to X2
    ehcApiBaseUrl: string;

    // EHC admin api
    ehcAdminApiBaseUrl: string;

    // EquipHealth
    equipmentHealthBaseUrl: string;

    // StandardWork
    standardWorkBaseUrl: string;

    // feature flags
    includedFeatures: string;
}

export class EnvironmentSettings {
  constructor(public baseSettings: IBaseEnvironmentSettings) {
    this.epicGroupsAPIv2 = `${
    this.baseSettings.mateoBaseUrl
          }api/v2/masterdata/epics`;
    this.epicGroupsAPIv3 = `${
    this.baseSettings.mateoBaseUrl
         }api/v3/masterdata/epics`;  
    this.influxDBBaseUrl = `${this.baseSettings.influxDBBaseUrl}`;
    this.includedFeatures = `${this.baseSettings.includedFeatures}`;
    this.influxDBQueryAPI = `${
        this.baseSettings.influxDBBaseUrl
          }/query`;
   this.equipmentHealthAPI = `${this.baseSettings.equipmentHealthBaseUrl}`;
      this.newEquipmentAPI = `${this.baseSettings.newEquipmentBaseUrl}`;
      this.ehcAPI = `${this.baseSettings.ehcApiBaseUrl}`;
      this.ehcAdminAPI = `${this.baseSettings.ehcAdminApiBaseUrl}`;


      this.schedulerUrl= `${
        this.baseSettings.mateoBaseUrl
             }admin/v2/scheduling/jobs`; 

      this.addSiteBasedSchedulerJobUrl= `${
       this.baseSettings.mateoBaseUrl
            }admin/v2/scheduling/sitebasedjob`; 

      this.updateSiteBasedSchedulerJobUrl= `${
        this.baseSettings.mateoBaseUrl
             }admin/v2/scheduling/jobs/`;
          
      this.standardWorkBaseUrl = `${this.baseSettings.standardWorkBaseUrl}`;
      this.workCenterAPI = `${this.baseSettings.fmpBaseUrl}api/WorkCenter/`;
    this.userProfileAPI = `${this.baseSettings.fmpBaseUrl}api/UserProfile/`;
    this.favoriteFilterAPI = `${
      this.baseSettings.fmpBaseUrl
    }api/SearchFavorites`;
    this.workStationAPI = `${this.baseSettings.fmpBaseUrl}api/WorkStation`;
    this.workStationAttributeAPI = `${
      this.baseSettings.fmpBaseUrl
    }api/WorkStationAttribute`;
    //        this.ActionAndAttrbuteAPI=`${this.baseSettings.fmpBaseUrl}api/ActionAndAttribute`;
    this.languageAPI = `${this.baseSettings.fmpBaseUrl}api/Language`;
    this.layoutAPI = `${this.baseSettings.fmpBaseUrl}api/Layout`;
    this.activityMonitorAPI = `${
      this.baseSettings.fmpBaseUrl
    }api/ActivityMonitor/EDOEnrichment`;
    this.patchEquipmentRequests = `${this.baseSettings.mateoBaseUrl}api/${
      this.baseSettings.mateoVersionNumber
    }/equipmentrequests/`;
    this.patchEquipmentDemandOrderRequests = `${
      this.baseSettings.mateoBaseUrl
    }api/${this.baseSettings.mateoVersionNumber}/equipmentdemandorders/`;
    this.patchEquipmentDemandFulfillmentRequests = `${
      this.baseSettings.mateoBaseUrl
    }api/${this.baseSettings.mateoVersionNumber}/equipmentdemandfulfillments/`;
    this.eventsAPI = `${this.baseSettings.fmpBaseUrl}api/PlanEvents`;

    this.roleAPI = `${this.baseSettings.fmpBaseUrl}api/Role`;
    this.cmmsRoleAPI = `${this.baseSettings.fmpBaseUrl}api/CMMSRole`;
    this.claimAPI = `${this.baseSettings.fmpBaseUrl}api/Claim`;
    this.workCenterSiteAPI = `${this.baseSettings.fmpBaseUrl}api/Site`;
    this.pAndSCommentAPI = `${this.baseSettings.fmpBaseUrl}api/PAndSComments`;
    this.saveWorkStationsByUserPreference = `${
      this.baseSettings.fmpBaseUrl
    }api/WorkStation/SaveWorkStationsByUserPreference`;
    this.getWorkStationsByUserPreference = `${
      this.baseSettings.fmpBaseUrl
    }api/WorkStation/GetWorkStationsByUserPreference`;

    this.equipmentAPI = `${
      this.baseSettings.fmpBaseUrl
    }api/PlanningAndScheduling/EquipmentEnrichment`;

    this.mateoUserAPI = `${this.baseSettings.mateoBaseUrl}api/${
      this.baseSettings.mateoVersionNumber
    }/users/`;
    this.mateoEquipmentRequestAPI = `${this.baseSettings.mateoBaseUrl}api/${
      this.baseSettings.mateoVersionNumber
    }/equipmentrequests/`;
    this.mateoSiteAPI = `${this.baseSettings.mateoBaseUrl}api/${
      this.baseSettings.mateoVersionNumber
    }/cmmssites/query`;
    this.tcoLogHistoryServiceAPI = `${
      this.baseSettings.qtrackBaseUrl
    }api/FmptcoLogs?ID=`;
    this.tcoReportUrl = this.tcoReportUrl =
      this.baseSettings.qtrackReportBaseUrl +
      'TCOCreation&rs:Command=Render&rs:Format=PDF&rc:Stylesheet=HtmlViewer_QTrac&pOrdDisp=';
    this.preShippingManifestUrl =
      this.baseSettings.preShippingManifestBaseUrl +
      'PreShippingManifest&rs:Command=Render&rs:Format=HTML4.0&rc:Stylesheet=HtmlViewer_QTrac';
    this.edoToolAssignedUrl =
      this.baseSettings.qtrackReportBaseUrl +
      'TCOToolsetStructure&rs:Command=Render&rs:Format=HTML4.0&rc:Stylesheet=HtmlViewer_QTrac&pOrdDisp=';
    this.directoryUrl = `${this.baseSettings.directoryUrl}query.cgi?alias=`;
    this.toolNameUrl = `${
      this.baseSettings.qtrackApplicationBaseUrl
    }QTracWebAppMain/ToolCollarOrder/AcceptReject.aspx?`;
    this.tcoLinkUrl = `${this.baseSettings.qtrackTCOBaseUrl}index.html#/QTrac/`;
    this.releaseNoteUrl = `${this.baseSettings.fmpBaseUrl}api/ReleaseNote/`;
    this.maximoBaseUrl = `${this.baseSettings.maximoBaseUrl}`;
    this.mtAssetNumberBaseUrl = `${this.baseSettings.mtAssetNumberBaseUrl}`;

    this.mateoEquipmentAPI = `${
      this.baseSettings.mateoBaseUrl
    }api/v1/equipments`;
    this.workOrderAPI = `${
      this.baseSettings.mateoBaseUrl
          }api/v2/workorders`;
      this.mappingDataAPI = `${
          this.baseSettings.fmpBaseUrl
          }api/SiteWhiteListing/`;
      this.refDataAPI = `${
          this.baseSettings.mateoBaseUrl
          }api/v1/masterdata/enabledSites`;

      this.ehcAvatarAPI = `${this.baseSettings.fmpBaseUrl}api/EhcData`;
  }

  get IsLocal(): boolean {
    return this.baseSettings.environment === ApplicationEnvironments.LOCAL;
  }
  get IsDevelopment(): boolean {
    return this.baseSettings.environment === ApplicationEnvironments.DEV;
  }
  get IsDemo(): boolean {
    return this.baseSettings.environment === ApplicationEnvironments.DEMO;
  }
  get IsProduction(): boolean {
    return this.baseSettings.environment === ApplicationEnvironments.PROD;
  }

  get UseMockData(): boolean {
    return this.IsLocal && this.baseSettings.usemockdata;
  }

  //#region FMP API Urls
  // WorkCenter Api
  workCenterAPI: string;
  // userProfile API
  userProfileAPI: string;
  // favoriteFilter API - Important ! Don't add / to the end.
  favoriteFilterAPI: string;
  // WorkStation API
  workStationAPI: string;
  // WorkStation API
  workStationAttributeAPI: string;

  // Language API
  languageAPI: string;
  // Role API
  roleAPI: string;
  // CMMS Role API
  cmmsRoleAPI: string;
  // Claim API
  claimAPI: string;
  // Activity Monitor API
  activityMonitorAPI: string;
  // Activity Monitor Patch
  patchEquipmentRequests: string;
  patchEquipmentDemandOrderRequests: string;
  patchEquipmentDemandFulfillmentRequests: string;

  // Events API
  eventsAPI: string;
  // Layout API
  layoutAPI: string;
  //#endregion

  // Work center module Site API
  workCenterSiteAPI: string;

  // save persisting workstation sequence
  saveWorkStationsByUserPreference: string;

  // get persisted work station order
  getWorkStationsByUserPreference: string;

  // PAndSComment API
  pAndSCommentAPI: string;
  // Workorder Details API
  workOrderAPI: string;
  // Reference Data API
  refDataAPI: string;
  // Mapping Data API
  mappingDataAPI: string;
  // Mateo Live API
  mateoEquipmentAPI: string;

  // equipment module API
  equipmentAPI: string;

  // Epic API
  epicGroupsAPIv2: string;
  epicGroupsAPIv3: string;

  // EquipmentHealth API
  equipmentHealthAPI: string;

    // New Equipment API
    newEquipmentAPI: string;

    ehcAPI: string;

    //ehc admin api
    ehcAdminAPI: string;

    ehcAvatarAPI: string;
 
  //Scheduler api
  schedulerUrl:string;
  //add site based Scheduler job api
  addSiteBasedSchedulerJobUrl:string;
  //update site based Scheduler job api
  updateSiteBasedSchedulerJobUrl:string;
  //#region Mateo Apis Urls
  // User Api
  mateoUserAPI: string;
  // Activity Monitor API
  mateoEquipmentRequestAPI: string;
  // Site API
  mateoSiteAPI: string;
  //#endregion

  //#region external Urls
  // TCO Log History Service API - QTRACK App
  tcoLogHistoryServiceAPI: string;
  // TCO Report Deepling - QTRACT SSRS Server
  tcoReportUrl: string;
  // preShippingManifestUrl- QTRACT SSRS Server
  preShippingManifestUrl: string;
  // Edo Tool Assigned Url
  edoToolAssignedUrl: string;
  // SLB LDAP Directory Url
  directoryUrl: string;
  // Qtrack Tool Name Url
  toolNameUrl: string;
  // TCO Link Url
  tcoLinkUrl: string;
  // Release Note Url
  releaseNoteUrl: string;

  mtAssetNumberBaseUrl: string;

  maximoBaseUrl: string;

  // Influx DB
  influxDBBaseUrl: string;
  // Influx API
  influxDBQueryAPI: string;
  //#endregion

  // equip health base 
  equipmentHealthBaseUrl: string;

  // new equip base
  newEquipmentBaseUrl: string;

  // standardWork
  standardWorkBaseUrl: string;

  // feature flags
  includedFeatures: string;

  get MockDataUrlMap(): Map<string, string> {
    return new Map([
      [this.mateoUserAPI, './assets/api/userprofile/userprofile.json'],
      [
        this.userProfileAPI + 'GetUserRoleLocation',
        './assets/api/userprofile/userpreferences.json',
      ],
      [
        this.mateoEquipmentRequestAPI,
        './assets/api/activitymonitor/activitymonitor.json',
      ],
      [
        this.tcoLogHistoryServiceAPI,
        './assets/api/activitymonitor/TCOLogs.json',
      ],
      [
        this.userProfileAPI + 'GetUserProfile?applicationName=ActivityMonitor',
        './assets/api/activitymonitor/amlayouts.json',
      ],
      [
        this.userProfileAPI + 'GetUserProfile?applicationName=PlanandSchedule',
        './assets/api/equipment/pnslayouts.json',
      ],
    ]);
  }
}

export interface IBaseAuthenticationSettings {
  AutoGetUserInfo: boolean;
  STSServer: string;
  PostLogoutRedirectUrl: string;
  ClientID: string;
  ResponseType: string;
  Scope: string;
  PostLoginRoute: string;
  ForbiddenRoute: string;
  UnAuthorizedRoute: string;
  TriggerAuthorizationResultEvent: boolean;
  LogConsoleWarningActive: boolean;
  LogConsoleDebugActive: boolean;
  MaxIdTokenIATOffsetAllowedInSeconds: number;
  AutoLoginRoute: string;
  TokenDataEmailIDKey: string;
  StartCheckSession: boolean;
  SilentRenew: boolean;
  SilentRenewUrl: string;
  SilentRenewOffsetInSeconds: number;
}

export class AuthenticationSettings {
  constructor(baseAuthSetting: IBaseAuthenticationSettings) {
    this.AutoGetUserInfo = baseAuthSetting.AutoGetUserInfo;
    this.STSServer = baseAuthSetting.STSServer;
    this.PostLogoutRedirectUrl = baseAuthSetting.PostLogoutRedirectUrl;
    this.ClientID = baseAuthSetting.ClientID;
    this.ResponseType = baseAuthSetting.ResponseType;
    this.Scope = baseAuthSetting.Scope;
    this.PostLoginRoute = baseAuthSetting.PostLoginRoute;
    this.ForbiddenRoute = baseAuthSetting.ForbiddenRoute;
    this.UnAuthorizedRoute = baseAuthSetting.UnAuthorizedRoute;
    this.TriggerAuthorizationResultEvent =
      baseAuthSetting.TriggerAuthorizationResultEvent;
    this.LogConsoleWarningActive = baseAuthSetting.LogConsoleWarningActive;
    this.LogConsoleDebugActive = baseAuthSetting.LogConsoleDebugActive;
    this.MaxIdTokenIATOffsetAllowedInSeconds =
      baseAuthSetting.MaxIdTokenIATOffsetAllowedInSeconds;
    this.AutoLoginRoute = baseAuthSetting.AutoLoginRoute;
    this.TokenDataEmailIDKey = baseAuthSetting.TokenDataEmailIDKey;
    this.StartCheckSession = baseAuthSetting.StartCheckSession;
    this.SilentRenew = baseAuthSetting.SilentRenew;
    this.SilentRenewUrl = baseAuthSetting.SilentRenewUrl;
    this.SilentRenewOffsetInSeconds =
      baseAuthSetting.SilentRenewOffsetInSeconds;
  }
  AutoGetUserInfo: boolean;
  STSServer: string;
  PostLogoutRedirectUrl: string;
  ClientID: string;
  ResponseType: string;
  Scope: string;
  PostLoginRoute: string;
  ForbiddenRoute: string;
  UnAuthorizedRoute: string;
  TriggerAuthorizationResultEvent: boolean;
  LogConsoleWarningActive: boolean;
  LogConsoleDebugActive: boolean;
  MaxIdTokenIATOffsetAllowedInSeconds: number;
  AutoLoginRoute: string;
  TokenDataEmailIDKey: string;
  StartCheckSession: boolean;
  SilentRenew: boolean;
  SilentRenewUrl: string;
  SilentRenewOffsetInSeconds: number;
}

export interface IRouteSetting {
  name: string;
  path: string;
  children?: IRouteSetting;
}

export interface IFMPRouteDetails {
  AutoLogin: IRouteSetting;
  Home: IRouteSetting;
  Logout: IRouteSetting;
  Dashboard: IRouteSetting;
  PlanningAndScheduling: IRouteSetting;
  WorkCenter: IRouteSetting;
  ActivityMonitor: IRouteSetting;
  ReleaseNotes: IRouteSetting;
  FMPError: IRouteSetting;
  Forbidden: IRouteSetting;
  NotFound: IRouteSetting;
  UnAuthorized: IRouteSetting;
  Language: IRouteSetting;
  Administration: IRouteSetting;
  HistorianProvision: IRouteSetting;
  EpisodeBrowser: IRouteSetting;
  EpicV3Browser:IRouteSetting;
  ClassificationEditor: IRouteSetting; 
  StandardWork: IRouteSetting; 
  DataMappingUtils: IRouteSetting;
  EquipmentHealth: IRouteSetting;
  SchedulerAdmin: IRouteSetting;
  HistorianManagement:IRouteSetting;
  ConflictManagement:IRouteSetting;
  AddSchedulerJob: IRouteSetting;
  UpdateSchedulerJob: IRouteSetting; 
  AuditLog:IRouteSetting;
  ChannelDefinition:IRouteSetting;
  ChannelDefinitionAdmin:IRouteSetting;
}

export interface IUOMDetails {
  Default: IUnitsOfMeasurement;
  Imperial: IUnitsOfMeasurement;
  Metric: IUnitsOfMeasurement;
  SI: IUnitsOfMeasurement;
}

export enum TempratureUnits {
  KELVIN = 'KELVIN',
  FAHRENHEIT = 'FAHRENHEIT',
  CELCIUS = 'CELCIUS',
}

export enum PressureUnits {
  ATM = 'ATM',
  PSI = 'PSI',
  BAR = 'BAR',
  PASCAL = 'PASCAL',
}

export interface IUnitsOfMeasurement {
  Name: string;
  Temprature: TempratureUnits;
  Pressure: PressureUnits;
}

export interface INameValueNumber {
  name: string;
  text?: string;
  value: number;
}

export interface INameValueString {
  name: string;
  text?: string;
  value: string;
}