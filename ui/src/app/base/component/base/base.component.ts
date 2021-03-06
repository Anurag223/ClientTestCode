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
import { LoggerService, DebugLog, ErrorLog, InfoLog, WarningLog } from 'src/app/base/service/logger.service';
import { GridConfigModel, GridGroupContext } from 'src/app/sharedcomponents/models/sharedmodels';
import { FMPHelper } from 'src/Constants/helpers';
import { AppService } from 'src/app/app.service';
import { ApplicationStateModel } from 'src/app/base/models/applicationmodels';
import { Router } from '@angular/router';
import { LogLevel } from 'src/Constants/application';
import { AppToasterService } from '../../toaster/toaster.service';
import { OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

export class BaseComponent implements OnChanges {

  public AppServiceInstance: AppService;
  public RouterInstance: Router;
  public ToasterServiceInstace: AppToasterService;
  constructor(public componentName: string, private _loggerService: LoggerService) {
    if(FMPHelper.AngularInjector) {
      this.AppServiceInstance = FMPHelper.AngularInjector.get(AppService);
      this.RouterInstance = FMPHelper.AngularInjector.get(Router);
      this.ToasterServiceInstace = FMPHelper.AngularInjector.get(AppToasterService);
    }
  }

  ngOnChanges(values) {

  }

  get IsUserLoggedIn(): boolean {
    return this.AppServiceInstance &&
      this.AppServiceInstance.ApplicationState &&
      this.AppServiceInstance.ApplicationState.IsAuthenticated &&
      this.AppServiceInstance.ApplicationState.Authorization &&
      this.AppServiceInstance.ApplicationState.Authorization.IsAuthorized;
  }
  get ApplicationState(): ApplicationStateModel {
    return this.AppServiceInstance.ApplicationState;
  }

  get CurrentLogLevel(): LogLevel {
    return this._loggerService.CurrentLogLevel;
  }

  get CurrentLogLevelString(): string {
    return LogLevel[Number(this.CurrentLogLevel)].toString();
  }

  WriteDebugLog(message: string, parameters?: Map<string, any>) {
    this._loggerService.WriteDebug(this.componentName, message, parameters);
  }

  WriteInfoLog(message: string, parameters?: Map<string, any>) {
    this._loggerService.WriteInfo(this.componentName, message, parameters);
  }

  WriteErrorLog(message: string, exception: any, parameters?: Map<string, any>) {
    this._loggerService.WriteError(this.componentName, message, exception, parameters);
  }

  WriteWarningLog(message: string, parameters?: Map<string, any>) {
    this._loggerService.WriteWarning(this.componentName, message, parameters);
  }

  SetLogLevel(_logLevel: LogLevel) {
    if (_logLevel) {
      this._loggerService.SetLogLevel(_logLevel);
    }
  }

  UnsubscribeObervable(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}


