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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/base/component/base/base.component';
import { LoggerService } from 'src/app/base/service/logger.service';
import { Subscription } from 'rxjs';
import { OidcSecurityService, OidcConfigService, ConfigResult, OpenIdConfiguration } from 'angular-auth-oidc-client';
import {
  UserProfileViewModel,
  Role,
  UserProfile,
  UserProfileDataModel,
  SavedPreference,
  UserRoleSiteViewModel,
  Profile,
  UserProfileRequestModel,
  IUserProfile,
  IRole,
} from 'src/app/base/models/userprofile';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { SiteDetailsService } from 'src/app/base/userprofile/sitedetails.service';
import * as LO from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppTranslateService } from 'src/app/app.translate.service';
import { Polling } from 'src/app/base/models/polling';
import { ApplicationSecurityService } from 'src/app/base/service/application-security.service';
import {
  RoleViewModel,
  FMPRole,
  CMMSRole,
  Claim,
} from 'src/app/base/models/role';
import { debug } from 'util';
import { FMPHelper, UnitOfMeasurements } from '../../../../Constants/helpers';
import { FMPConstant } from '../../../../Constants/constant';

/**
 * Home Component Fecthes the User Profiles from CMMS System (Mateo) and User Preferences from FMP (Mongo DB)
 * Processes and Maps the profiles and preferences and show in the user profile section in FMP
 * @export
 * @class HomeComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  userDataSubscription: Subscription;
  userProfileSubcription: Subscription;
  userProfileApiSubscription: Subscription;
  userProfileErrorSubscription: Subscription;
  siteApiSubscription: Subscription;
  siteApiErrorSubscription: Subscription;

  userDataModel: UserProfileDataModel;
  viewModel: UserProfileViewModel;
    roleViewModel: RoleViewModel;
    userAuthInfo: any;
    isHistorianAdmin: boolean = false;
    HISTORIANKEY: string = "a69e672a-a8a0-4711-8ee9-b11023e04da4";
  /**
   *Creates an instance of HomeComponent.
   * @param {LoggerService} _logger
   * @param {OidcSecurityService} oidcSecurityService
   * @param {UserprofileService} _userProfileservice
   * @param {LoaderService} _loaderService
   * @param {SiteDetailsService} _siteDetailsService
   * @param {Router} router
   * @param {AppTranslateService} _AppTranslateService
   * @param {ApplicationSecurityService} _applicationSecurityService
   * @memberof HomeComponent
   */
  constructor(
    _logger: LoggerService,
      private oidcSecurityService: OidcSecurityService,
      private oidcConfigService: OidcConfigService,
    private _userProfileservice: UserprofileService,
    private _loaderService: LoaderService,
    private _siteDetailsService: SiteDetailsService,
    private router: Router,
    private _AppTranslateService: AppTranslateService,
    private _applicationSecurityService: ApplicationSecurityService,
  ) {
    super('HomeComponent', _logger);
    this.userDataModel = this._userProfileservice.dataModel;
    this.viewModel = new UserProfileViewModel(
      this._userProfileservice.dataModel,
    );
    this.roleViewModel = new RoleViewModel(
      this._applicationSecurityService.dataModel,
    );
  }

  /**
   *On Init Function.
   *
   * @memberof HomeComponent
   */
  ngOnInit() {
    //this._loaderService.showSpinner();

    // User Profile Api Error Subcription
    this.userProfileErrorSubscription = this._userProfileservice.userProfileErrorObservable.subscribe(
      error => {
        this.handleUnauthorizedUser(
          'Error Fetching User Profile from MATEO.',
          error,
        );
      },
    );

    // Subscibe to mateo site api service and add siteid to profile object
    /**
      this.siteApiSubscription = this._siteDetailsService.siteApiObservable.subscribe(
      siteDetails => {
        this.WriteDebugLog(
          'Site Details Received.',
          new Map().set('Site', siteDetails),
        );
        if (siteDetails) {
          this.userDataModel.user.role.forEach(r => {
            r.profile.forEach(p => {
              if (p.workLocation === siteDetails[0].site.code) {
                p.siteDetails = siteDetails[0].site;
              }
            });
          });
        }
      },
      err => this.WriteErrorLog('Error fetching site details.', err),
    );

    this.siteApiSubscription = this._siteDetailsService.siteErrorObservable.subscribe(
      error => {
        this.WriteErrorLog(
          'Failed to fetch data for Site',
          new Map().set('ERROR', error),
        );
      },
      err =>
        this.WriteErrorLog('Error while handeling Site Error Observable.', err),
    );
    **/
    this.userDataSubscription = this.oidcSecurityService
      .getUserData()
      .subscribe(
        (userAuthInfo: any) => {
          this.userAuthInfo = userAuthInfo;
              this.userDataModel.LDAP = this.getUserLDAP(userAuthInfo);
              if (userAuthInfo != null) {
               
                  this.isHistorianAdmin = this.getUserIsHistorianAdmin(userAuthInfo);
              }
          if (!FMPHelper.StringIsNullOrWhiteSpace(this.userDataModel.LDAP)) {

              // this code only runs once... before the above sub gets invoked.
  
              const queryModel: UserProfileRequestModel = new UserProfileRequestModel();
              queryModel.userldap = this.userDataModel.LDAP;
              

              // KEEP THIS HERE and uncopmment and comment the above line IF WE WANT TO ALWAYS USE ONLY LDAP AUTH...
              let tmpUserProfile: IUserProfile = {
                  firstName: this.getUserFirstName(userAuthInfo),
                  lastName: this.getUserLastName(userAuthInfo),
                  ldapAlias: this.userDataModel.LDAP,
                  email: this.getUserEmail(userAuthInfo),
                  ginNumber: '',
                  active: true,
                  activeCMMS: '',
                  role: [],
                  selectedUserRole: null,
                  lastReleaseNoteDismiss: 0,
              }

              this.userDataModel.user = new UserProfile(tmpUserProfile);

              this.processUserProfiles();
 
          }
        },
        err => {
          this.handleServiceError(
            'Error in fetching User Details from Identity Server:',
            err,
          );
        },
      );
  }


  /**
   * This function process the user profiles coming from MATEO and FMP (Saved user preferences)
   *
   * @memberof HomeComponent
   */
  processUserProfiles() {
    this._userProfileservice
      .getUserProfilePreferences(this.userDataModel.LDAP)
      .subscribe(
        profilePreferences => {
          this.userDataModel.user.role = this.userDataModel.user.role ? this.userDataModel.user.role: [];
          this.userDataModel.user.ldapAlias = this.userDataModel.LDAP.toLowerCase();


            if (!this.userDataModel.user
                || !this.userDataModel.user.role
                || this.userDataModel.user.role.length === 0)
            {
                this.WriteWarningLog('No profiles/roles found in CMMS\'s. Using SLB ldap only. Access to some features may be limited.');
                //this.ToasterServiceInstace.ShowInformation('No profiles/roles found in CMMS\'s. Access to some features may be limited.');
                //this.handleUnauthorizedUser(
                //    'No profiles found in CMMS. User do not have access to this resource.', 'No profiles found in CMMS. User do not have access to this resource.');
                
                let tmpUserProfile: IUserProfile = {
                    firstName: this.getUserFirstName(this.userAuthInfo),
                    lastName: this.getUserLastName(this.userAuthInfo),
                    ldapAlias: this.userDataModel.LDAP,
                    email: this.getUserEmail(this.userAuthInfo),
                    ginNumber: '',
                    active: true,
                    activeCMMS: '',
                    role: [],
                    selectedUserRole: null,
                    lastReleaseNoteDismiss: 0,
                }

                this.userDataModel.user = new UserProfile(tmpUserProfile);
                
            }
            //else // profiles found in cmms
            if (this.userDataModel.user) // was nothing before.
            {

                  // Add mock data profiles to logged in user profiles.
                let defaultRole: Role = new Role(
                    {
                    name: 'FMA Default Role',
                    description: 'Default Role for FMP Mateo Admin',
                    profile: null,
                    link: null,
                    }
                );

                this.userDataModel.user.role = [defaultRole];


                if (profilePreferences && profilePreferences.length > 0)
                {
                    const activePreference = profilePreferences.find(
                        r => r.isActive === true,
                    );
                    if (activePreference) {
                        this.userDataModel.user.isAdmin = activePreference.isAdmin;
                        this.userDataModel.user.isDeveloper =
                        activePreference.isDeveloper;
                    }
                    if (profilePreferences[0].savedPreference) {
                        this.userDataModel.preference = new SavedPreference(
                        profilePreferences[0].savedPreference,
                        );
                    } else {
                        this.setDefaultUserPreferences(this.userDataModel);
                    }


                    this.userDataModel.user.refreshInterval = profilePreferences.find(
                        a => a.isActive === true,
                    ).refreshInterval;
                    this.userDataModel.user.lastReleaseNoteDismiss = profilePreferences.find(
                        a => a.isActive === true,
                    ).lastReleaseNoteDismiss;
                    if (
                        !LO.some<Role>(
                        this.userDataModel.user.role,
                        r => r.isSelected,
                        )
                    ) {
                        this.userDataModel.user.role[0].isSelected = true;
                    }
                    } else {
                    this.setDefaultUserPreferences(this.userDataModel);
                    if (
                        this.userDataModel.user.role &&
                        this.userDataModel.user.role.length > 0
                    ) {
                        this.userDataModel.user.isAdmin = false;
                        this.userDataModel.user.isDeveloper = false;
                        this.userDataModel.user.role.forEach(rl => {
                        if (rl.profile && rl.profile.length > 0) {
                            rl.profile[0].isSelected = true;
                        }
                        });
                        this.userDataModel.user.role[0].isSelected = true;
                        this._userProfileservice
                        .saveUserRoleSiteMapping(this.userDataModel.user)
                        .subscribe(
                            appName => {},
                            (err: HttpErrorResponse) => {
                            this.WriteErrorLog(
                                'Error in saveUserRoleSiteMapping:',
                                err,
                            );
                            },
                        );
                    }
                }
                  this._loaderService.hideSpinner();
                  this.ApplicationState.Authorization.IsAuthorized = true;
                  //Navigate user to default route on login, instead of routing to his last accessed application.
                  this.router.navigate([FMPHelper.Routes.EquipmentHealth.path]);  
                  

            } //end else  if user exists
          // this._loaderService.hideSpinner();
        }, // end subscription block on retrieving user prefs
        err => {
          this.handleServiceError(
            'Error in fetching UserProfilePreferences:',
            err,
          );
        },
      );
  }

  /**
   * This function sets Default user preferences
   *
   * @private
   * @param {UserProfileDataModel} userData
   * @memberof HomeComponent
   */
  private setDefaultUserPreferences(userData: UserProfileDataModel): void {
    userData.preference = new SavedPreference(null);
    userData.preference.unitOfMeasurement = UnitOfMeasurements.Default.Name;
  }



  /**
   * This function handles service errors
   *
   * @private
   * @param {string} message
   * @param {*} error
   * @memberof HomeComponent
   */
  private handleServiceError(message: string, error: any) {
    this.WriteErrorLog(message, error);
    this._loaderService.hideSpinner();
    this.router.navigate([FMPHelper.Routes.FMPError.path]);
  }

  private handleUnauthorizedUser(message: string, error: any) {
    this.WriteErrorLog(message, error);
    this._loaderService.hideSpinner();
    this.router.navigate([FMPHelper.Routes.UnAuthorized.path]);
  }


  /**
   * This function returns the user ldap
   *
   * @param {*} userAuthInfo
   * @returns {string}
   * @memberof HomeComponent
   */
  getUserLDAP(userAuthInfo): string {
    const email = userAuthInfo[
      FMPHelper.AuthenticationSettings.TokenDataEmailIDKey
      ] as string
      if (email != null) {
          const ldap = email.split('@')[0];
          return ldap.toLowerCase();
      }
      else {
          // need to login
          //this.oidcSecurityService.logoff;
          //this.oidcSecurityService.authorize;
      }
    }
    getUserEmail(userAuthInfo): string {
        const email = userAuthInfo[
            FMPHelper.AuthenticationSettings.TokenDataEmailIDKey
        ] as string;
        return email;
    }
    getUserFirstName(userAuthInfo): string {
        const firstName = userAuthInfo[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'
        ] as string;
        return firstName;
    }
    getUserLastName(userAuthInfo): string {
        const firstName = userAuthInfo[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'
        ] as string;
        return firstName;
    }
    getUserIsHistorianAdmin(userAuthInfo): boolean {
        
        let groups: any[] = userAuthInfo.groups;
        if (groups != null && groups.includes(this.HISTORIANKEY)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * This function navigates the user to the last application name visited.
     * 17-11-2021: Though we dont use it from this date onwards, as its decided to navigate user
     * to a default page now.
     * But we will keep this function for future.
     * @param {*} appName
     * @memberof HomeComponent
     */
    navigateUserToLastSavedApplication(appName) {

        let features: string[] = [];      
        
        // get first feature and route user to that
        if(FMPHelper.ApplicationSettings.includedFeatures.length > 0)
        {
            features = FMPHelper.ApplicationSettings.includedFeatures.split(',');
            // find the corresponding route
        }
        
       
        

        switch (appName) {
            case FMPConstant.dashboard:
                if (features.includes(FMPConstant.dashboard))
                {
                    this.router.navigate([FMPHelper.Routes.Dashboard.path]);
                    break;
                }
            case FMPConstant.classificationEditor:
                if (features.includes(FMPConstant.classificationEditor)) {
                    this.router.navigate([FMPHelper.Routes.ClassificationEditor.path]);
                    break;
                }
            case FMPConstant.historianProvision:
                if (features.includes(FMPConstant.historianProvision) && this.isHistorianAdmin) {
                    this.router.navigate([FMPHelper.Routes.HistorianProvision.path]);
                    break;
                }
            case FMPConstant.episodeBrowser:
                if (features.includes(FMPConstant.episodeBrowser)) {
                    this.router.navigate([FMPHelper.Routes.EpisodeBrowser.path]);
                    break;
                }
                case FMPConstant.epicv3Browser:
                  if (features.includes(FMPConstant.epicv3Browser)) {
                      this.router.navigate([FMPHelper.Routes.EpicV3Browser.path]);
                      break;
                  }
            case FMPConstant.equipmentHealth:
                if (features.includes(FMPConstant.equipmentHealth)) {
                    this.router.navigate([FMPHelper.Routes.EquipmentHealth.path]);
                    break;
                }
             case FMPConstant.historianManagement:
                  if (features.includes(FMPConstant.historianManagement)) {
                      this.router.navigate([FMPHelper.Routes.HistorianManagement.path]);
                      break;
                  }
             case FMPConstant.conflictManagement:
                  if (features.includes(FMPConstant.conflictManagement)) {
                      this.router.navigate([FMPHelper.Routes.ConflictManagement.path]);
                      break;
                  }
            case FMPConstant.administration:
                if (features.includes(FMPConstant.administration)) {
                    this.router.navigate([FMPHelper.Routes.Administration.path]);
                    break;
                }
                case FMPConstant.auditLog:
                  if (features.includes(FMPConstant.auditLog)) {
                      this.router.navigate([FMPHelper.Routes.AuditLog.path]);
                      break;
                  }
                  case FMPConstant.channelDefinition:
                  if (features.includes(FMPConstant.channelDefinition)) {
                      this.router.navigate([FMPHelper.Routes.ChannelDefinition.path]);
                      break;
                  }
            default:
                this.router.navigate([FMPHelper.Routes.EquipmentHealth.path]);
        }
    }

  /**
   * Unsubscribe to all the subcriptions in ngOnDestory function.
   *
   * @memberof HomeComponent
   */
  ngOnDestroy() {
    this.UnsubscribeObervable(this.userDataSubscription);
    this.UnsubscribeObervable(this.userProfileSubcription);
    this.UnsubscribeObervable(this.userProfileApiSubscription);
    this.UnsubscribeObervable(this.userProfileErrorSubscription);
    this.UnsubscribeObervable(this.siteApiSubscription);
  }
}
