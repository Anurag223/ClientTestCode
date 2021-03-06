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
import { Component, OnInit, TemplateRef, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
// import { UserRoleSiteDataModel, UserProfileViewModel, Role, Profile, IRole } from '../models/userprofile';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import { UserProfileViewModel, Role, UserPreference } from 'src/app/base/models/userprofile';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BaseComponent } from 'src/app/base/component/base/base.component';
import { BsModalService } from 'ngx-bootstrap';
import { LoggerService } from 'src/app/base/service/logger.service';
import { IUnitsOfMeasurement } from 'src/Constants/application';
import { UnitOfMeasurements } from 'src/Constants/helpers';

@Component({
  selector: 'app-userprefrence',
  templateUrl: './userprefrence.component.html',
  styleUrls: ['./userprefrence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserprefrenceComponent extends BaseComponent implements OnInit {

  @Input() userProfileModel: UserProfileViewModel;
  SelectedUOM: string;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'userprefrencePopUP'
  };

  UserRole: String = '';

  /**
   * listItems is used as a data source for User preferenced dropdown
   *
   * @type {string[]}
   * @memberof UserprefrenceComponent
   */
  public listItems: string[] = [
    UnitOfMeasurements.Default.Name,
    UnitOfMeasurements.Metric.Name,
    UnitOfMeasurements.Imperial.Name,
    UnitOfMeasurements.SI.Name,
  ];

  constructor(private _userProfileservice: UserprofileService,
    private _modalService: BsModalService,
    _loggerService: LoggerService
  ) {
    super('UserprefrenceComponent', _loggerService);
    this.WriteDebugLog('UserprefrenceComponent => constructor');
  }

  /**
   * This is the angular life cycle hookup for ngOnInit
   * We check if the UserPrefernces are loaded for the current user or not
   * If the User preferences present then we set the UOM preferences for the user
   * @memberof UserprefrenceComponent
   */
  ngOnInit() {
    this.WriteDebugLog('UserprefrenceComponent => ngOnInit');
    if (this.userProfileModel && this.userProfileModel.data &&
      this.userProfileModel.data.preference && this.userProfileModel.data.preference.unitOfMeasurement) {
      this.SelectedUOM = this.userProfileModel.data.preference.unitOfMeasurement;
      if (this.userProfileModel.data.user) {
        if (this.userProfileModel.data.user.isAdmin === true && this.userProfileModel.data.user.isDeveloper === false) {
          this.UserRole = 'Sustaning Admin Role';
        } else if (this.userProfileModel.data.user.isDeveloper === true && this.userProfileModel.data.user.isAdmin === false) {
          this.UserRole = 'Developer Role';
        } else if (this.userProfileModel.data.user.isAdmin === false && this.userProfileModel.data.user.isDeveloper === false) {
          this.UserRole = '';
        } else if (this.userProfileModel.data.user.isAdmin === true && this.userProfileModel.data.user.isDeveloper === true) {
          this.UserRole = 'Sustaning Admin & Developer Role';
        }
      }
    }
  }

  /**
   * onOpenUserPrefrencePopup is used to open the User prefernces popup
   * once the UserPreference pop up is opened the User Details pop up is closed
   * @param {TemplateRef<any>} userPrefrencesTemplate
   * @param {*} userPrefrences
   * @memberof UserprefrenceComponent
   */
  onOpenUserPrefrencePopup(userPrefrencesTemplate: TemplateRef<any>, userPrefrences) {
    this.WriteDebugLog('UserprefrenceComponent => onOpenUserPrefrencePopup');
    this.SelectedUOM = this.userProfileModel.data.preference.unitOfMeasurement;
    if (!this.modalRef) {
      this.modalRef = this._modalService.show(userPrefrencesTemplate, this.config);
      userPrefrences.hide();
    }
  }


  /**
   * onCloseUserPrefrenceModal method is used to hide the Modal pop up for user preferences
   *
   * @memberof UserprefrenceComponent
   */
  onCloseUserPrefrenceModal() {
    this.WriteDebugLog('UserprefrenceComponent => onCloseUserPrefrenceModal');
    this.modalRef.hide();
    this.modalRef = undefined;
  }

  /**
   * onSaveUserPreference method is called when user changes the UOM prefernces from the pop up
   * It saves the user preferred UOM in mongo database and then loads back when the user loads application
   *
   * @memberof UserprefrenceComponent
   */
  onSaveUserPreference() {
    const userPreference: UserPreference = new UserPreference(null);
    userPreference.userID = this.userProfileModel.data.user.ldapAlias;
    this.userProfileModel.data.preference.unitOfMeasurement = this.SelectedUOM;
    userPreference.savedPreference = this.userProfileModel.data.preference;
    this._userProfileservice.UpdateUserPreferences(userPreference).subscribe(success => {
      if (success) {
        this.onCloseUserPrefrenceModal();
        this.ToasterServiceInstace.ShowSuccess('User Preference saved successfully.');
        this._userProfileservice.userPreferencesObservable.next(this.userProfileModel.data.preference);
      } else {
        this.ToasterServiceInstace.ShowWarning('User Preference has not changed.');
      }
    }, err => {
      this.WriteErrorLog('User Preference save failed.', err);
      this.ToasterServiceInstace.ShowError('User Preference save failed.');
    });
  }
}

