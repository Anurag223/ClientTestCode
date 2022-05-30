import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FMPHelper } from '../../../../../Constants/helpers';
import { IBaseMapperViewModel } from '../models/basemapper-model';

@Injectable({
    providedIn: 'root',
})
export class BaseMapperService {
    public allWhitelistedSites;
    private sites$: BehaviorSubject<any[]>;
    constructor(private http: HttpClient) {
        this.sites$ = new BehaviorSubject<any[]>(null);
    }
    setWhitelistedSites(data) {
        return this.http.post(
            `${
            FMPHelper.ApplicationSettings.mappingDataAPI
            }SaveWhiteListedSites`,
            data,
        );
    }
    getSitesByApplication(sites, appName) {
        sites.map(site => {
            site.permissions =
                site &&
                site.workLocation &&
                this.getPermisssionByApp(site.workLocation);
            site.isVisible = !site.permissions.some(permission => {
                if (
                    permission.applicationName === appName &&
                    !permission.view &&
                    !permission.edit
                ) {
                    return false;
                } else if (
                    permission.applicationName === appName &&
                    (permission.view || permission.edit)
                ) {
                    return true;
                }
            });
        });
        this.sites$.next(sites);
    }
    getWhiteListedSitesObservable(): Observable<any[]> {
        return this.sites$;
    }
    getPermisssionByApp(code) {
        const sitepermission = this.allWhitelistedSites.find(site => {
            return site.Site_ID === code;
        });
        return sitepermission ? sitepermission.permissions : [];
    }
    getWhitelistedSites() {
        return this.http.get(
            `${
            FMPHelper.ApplicationSettings.mappingDataAPI
            }GetAllWhiteListedSites`,
        );
    }
    updateWhitelistedSites(data) {
        return this.http.patch(
            `${
            FMPHelper.ApplicationSettings.mappingDataAPI
            }UpdateWhiteListedSitePermissions`,
            data,
        );
    }
    SaveWorkOrderNumericalPriority(data) {
        return this.http.post(
            `${
            FMPHelper.ApplicationSettings.mappingDataAPI
            }SaveNumericalPriorityByWorkOrder`,
            data,
        );
    }
    getWorkOrderPriorityBySiteList(data) {
        return this.http.get(
            `${
            FMPHelper.ApplicationSettings.mappingDataAPI
            }GetNumericalPriorityBySiteIdList?sites=` + data,
        );
    }

    getEnabledSites() {
        return this.http.get(`${FMPHelper.ApplicationSettings.refDataAPI}`);
    }

}
