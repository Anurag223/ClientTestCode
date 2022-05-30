#!/bin/bash

echo "generating env.js"

#define the template.
cat > env.js << EOF
(function(window) {
  window.__env = window.__env || {};

  window.__env.baseUrls = {
    usemockdata: false,
    environment: '$FMP_UI_ENVIRONMENT',
    logLevel: 4,
    mateoVersionNumber: 'v1',
    mateoApiV2: 'v2',
    mateoBaseUrl: '$MATEOBASEURL',
    fmpBaseUrl: '$FMPBASEURL',
    directoryUrl: 'https://directory.slb.com/',
	influxDBBaseUrl: '$INFLUXDBURL',
    equipmentHealthBaseUrl: '$EQUIPMENTHEALTHBASEURL',
	newEquipmentBaseUrl: '$NEWEQUIPMENTBASEURL', 
	ehcApiBaseUrl: '$EHCAPIBASEURL',
  ehcAdminApiBaseUrl: '$EHCADMINAPIBASEURL', 
	standardWorkBaseUrl: '$STANDARDWORKBASEURL',
    includedFeatures: '$INCLUDEDFEATURES',
  };

  window.__env.authenticationConfiguration = {
    AutoGetUserInfo: false,
    STSServer: '$STSSERVER',
    PostLogoutRedirectUrl: '$POSTLOGOUTREDIRECTURL',
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
    MaxIdTokenIATOffsetAllowedInSeconds: 300,
    AutoLoginRoute: '/auto-login',
    TokenDataEmailIDKey:
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
    StartCheckSession: false,
    SilentRenew: true,
    SilentRenewUrl: '$SILENTRENEWURL',
    SilentRenewOffsetInSeconds: 60,

  };
})(this);
EOF

echo "copying env.js to /usr/share/nginx/html/"
cp env.js /usr/share/nginx/html/

FILE=/usr/share/nginx/html/env.js
if [ -f "$FILE" ]; then
    echo "$FILE copied"
    echo "printing first 6 lines:"
    head -n 6 /usr/share/nginx/html/env.js
else 
  echo "file wasn't copied"
fi

exec "$@"