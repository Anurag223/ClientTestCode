(function(window) {
  window.__env = window.__env || {};

  window.__env.baseUrls = {
    // Use Mock Data
    usemockdata: false,
    // Current Environment
    environment: 'LOCAL',
    // Log Level
    logLevel: 4,
    // Mateo Version
    mateoVersionNumber: 'v1',
    // Mateo Apis Base url
   //mateoBaseUrl: 'http://fed.dev.tlm.slb.com/',
    mateoBaseUrl: 'https://api.test.tlm.slb.com/',
    // FMP API Base Url
    //fmpBaseUrl: 'http://apps.demo.tlm.slb.com/',
  //fmpBaseUrl: 'http://localhost:56540/',
    //fmpBaseUrl: 'http://localhost:32211/',
    fmpBaseUrl: 'http://a2r-utils.test.tlm.slb.com/',
    //fmpBaseUrl: 'http://apps.demo.tlm.slb.com/tlm-utils/',

    // SLB directory Base Url
    directoryUrl: 'http://directory.slb.com/',

    //InfluxDB Url
    influxDBBaseUrl: 'http://gcp6629devsrv03.earaa6629.gcp.slb.com:8086',
    equipmentHealthBaseUrl: 'https://api.test.tlm.slb.com/api/v2/equipment/',
    newEquipmentBaseUrl: 'https://api.test.tlm.slb.com/api/v2/equipment/', 
    //equipmentHealthBaseUrl: 'http://api.dev.tlm.slb.com/api/v2/equipment/',
    //newEquipmentBaseUrl: 'http://api.dev.tlm.slb.com/api/v2/equipment/', 

    //ehcApiBaseUrl: 'https://api.ehc.qa.slb.com/v2',
      //ehcApiBaseUrl: 'https://evd.apigateway.slb.com/a2r_ehc_historian',
      //ehcApiBaseUrl: 'https://apigateway.evq.it.slb.com/a2r_ehc_historian/v2',
    ehcApiBaseUrl: 'https://api.ehc.dev.slb.com/v2',
   ehcAdminApiBaseUrl: 'https://api.ehc.dev.slb.com/admin/v2',
    // ehcApiBaseUrl: 'http://localhost:4080/v2',
     //ehcAdminApiBaseUrl:'http://localhost:4081/admin/v2',
    // StandardWork Base Url
    standardWorkBaseUrl: 'http://localhost:5000/api/v2/standardwork',
    //standardWorkBaseUrl: 'http://api.test.esw.slb.com/api/v2/standardwork',

    includedFeatures: 'EpicV3Browser,EquipmentHealth, EpisodeBrowser, SchedulerAdmin, HistorianManagement, ConflictManagement, AuditLog,ChannelDefinition,ChannelDefinitionAdmin'// these are based on FMPConstant

  };

  window.__env.authenticationConfiguration = {
    AutoGetUserInfo: false,
   STSServer: 'https://auth.test.tlm.slb.com',
  //STSServer: 'https://auth.dev.tlm.slb.com',
  PostLogoutRedirectUrl: 'pages/logout.html',
    ClientID: 'tlm-utilclient',
    ResponseType: 'id_token token',
    Scope:
      'openid profile email userapi equipmentapi workorderapi masterdataapi siteapi tlmutilsapi ehcapi schedulingapi ehcadminapi',
    PostLoginRoute: '/home',
    ForbiddenRoute: '/forbidden',
    UnAuthorizedRoute: '/unauthorized',
    TriggerAuthorizationResultEvent: true,
    LogConsoleWarningActive: true,
    LogConsoleDebugActive: false,
    MaxIdTokenIATOffsetAllowedInSeconds: 180,
    AutoLoginRoute: '/auto-login',
    TokenDataEmailIDKey:
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
    StartCheckSession: false,
    SilentRenew: false,
    SilentRenewUrl: 'pages/silent-renew.html',
    SilentRenewOffsetInSeconds: 5
  };
})(this);
