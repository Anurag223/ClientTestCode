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
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConfigPaths } from 'src/Constants/helpers';
import { FmpErrorComponent } from './ErrorPages/fmp-error/fmp-error.component';
import { UnauthorizedComponent } from './ErrorPages/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './ErrorPages/forbidden/forbidden.component';
import { NotfoundComponent } from './ErrorPages/notfound/notfound.component';
import { FMPAuthGuard } from 'src/app/base/helpers/Guard/fmpauth.guard';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    //#region Authentication Routes
    {
        path: RouteConfigPaths.AutoLogin.name,
        component: AutoLoginComponent
    },
    {
        path: RouteConfigPaths.Logout.name,
        component: LogoutComponent
    },
    //#endregion

    //#region Protected Routes
    {
        path: RouteConfigPaths.Home.name,
        component: HomeComponent,
        canActivate: [FMPAuthGuard],
        canLoad: [FMPAuthGuard]
    },
    //#region

    //#region Error Page Routes (Unprotected)
    {
        path: RouteConfigPaths.FMPError.name,
        component: FmpErrorComponent
    },
    {
        path: RouteConfigPaths.UnAuthorized.name,
        component: UnauthorizedComponent
    },
    {
        path: RouteConfigPaths.Forbidden.name,
        component: ForbiddenComponent
    },
    {
        path: RouteConfigPaths.NotFound.name,
        component: NotfoundComponent
    },
    //#endregion
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationCommonRoutingModule { }

// export const ApplicationCommonRoutes = RouterModule.forChild(routes);