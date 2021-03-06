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
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, map, retry } from 'rxjs/operators';
import { FMPHelper } from 'src/Constants/helpers';
import { AppService } from 'src/app/app.service';

@Injectable()
export class FMPAuthGuard<T> extends DataService implements CanActivate, CanLoad {
  constructor(_http: HttpClient,
    _loggerService: LoggerService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private _appService: AppService) {
    super('FMPAuthGuard', '', _http, _loggerService);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.checkIsAuthenticated();
  }

  canLoad(state: Route): Observable<boolean> {
    return this.checkIsAuthenticated();
  }

  private checkIsAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthenticated: boolean) => {
        this.WriteDebugLog('AuthorizationGuard, canActivate isAuthorized: ' + isAuthenticated);
        if (!isAuthenticated) {
          this._appService.ApplicationState.IsAuthenticated = isAuthenticated;
          this.router.navigate([FMPHelper.Routes.UnAuthorized.path]);
        }
        return isAuthenticated;
      }),
      catchError(err => {
        this._appService.ApplicationState.IsAuthenticated = false;
        this.WriteErrorLog('Authentication for route failed.', err);
        return of(false);
      })
    );
  }
}
