import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { EntitlementService } from './entitlement.service';
import {
  EntitlementViewModel,
  RoleCategoryDataModel,
  RoleCategoryReq,
} from '../models/entitlement';
import * as LO from 'lodash';
import { UserprofileService } from '../../../base/userprofile/userprofile.service';
import { FMPHelper } from '../../../../Constants/helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fmp-entitlement',
  templateUrl: './entitlement.component.html',
  styleUrls: ['./entitlement.component.scss'],
})
export class EntitlementComponent extends BaseComponent
  implements OnInit, OnDestroy {
  public viewModel: EntitlementViewModel;
  public btnDisableFlag = true;
  public roleCategorySaveReq: RoleCategoryReq[] = [];
  public roleCategoryData = [];
  public parentCategoryId: number;
  public lastUpdatedBy = '';
  public lastUpdatedDateTime = '';
  private getRoleRefVariable;
  private updateRequestRevVariable;
  private cancelBtnRefVariable;

  constructor(
    loggerService: LoggerService,
    public entitlementService: EntitlementService,
    private userProfileService: UserprofileService,
    private router: Router,
  ) {
    super('WorkCenterComponent', loggerService);
  }

  ngOnInit() {
    this.viewModel = new EntitlementViewModel();
    if (
      this.userProfileService.dataModel.user &&
      this.userProfileService.dataModel.user.isAdmin
    ) {
      this.viewModel.selectedCategory = this.viewModel.categoryField[0];
      this.getClaimCategoryData();
      this.getRolesData();
    } else {
      this.router.navigate([FMPHelper.Routes.UnAuthorized.path]);
    }
  }

  /**
   * This method is used to get Roles Data
   */
  getRolesData() {
    this.entitlementService.getRolesAdmin('false').subscribe(
      roleAdminData => {
        this.roleCategorySaveReq = [];
        this.roleCategoryData = [];
        this.viewModel.roleAdminData = [];
        if (roleAdminData && roleAdminData.length > 0) {
          this.roleCategoryData = roleAdminData;
          // const refVariable = this;
          this.getRoleRefVariable = this;
          let localUpdateTime = 0;
          roleAdminData.forEach(item => {
            this.getRoleRefVariable.viewModel.roleAdminData.push(
              new RoleCategoryDataModel(item),
            );
            if (item.lastUpdatedDateTime && item.lastUpdatedBy) {
              const itemDate = new Date(item.lastUpdatedDateTime).getTime();
              if (itemDate > localUpdateTime) {
                localUpdateTime = itemDate;
                this.lastUpdatedBy = item.lastUpdatedBy;
                this.lastUpdatedDateTime = item.lastUpdatedDateTime;
              }
            }
          });
        }
      },
      error => {
        this.WriteErrorLog('error in getRolesAdmin subscribe', error);
        this.ToasterServiceInstace.ShowError('Something Went wrong.');
      },
    );
  }

  /**
   * This method is used to get Claim according to Category
   * Which we are selecting from Dropdown.
   */
  getClaimCategoryData() {
    let selectedCategoryKey: string;
    switch (this.viewModel.selectedCategory) {
      case 'Activity Monitor':
        selectedCategoryKey = 'AM';
        break;
      case 'Admin/Workcenter':
        selectedCategoryKey = 'ADM';
        break;
      case 'Plan & Schedule':
        selectedCategoryKey = 'PNS';
        break;
      default:
        selectedCategoryKey = 'AM';
    }
    this.entitlementService.getClaimsCategory(selectedCategoryKey).subscribe(
      claimCategoryData => {
        this.viewModel.claimCategoryData = claimCategoryData;
        this.parentCategoryId = this.viewModel.claimCategoryData[0].overrideClaimId;
      },
      error => {
        this.WriteErrorLog('error in getClaimsCategory subscribe', error);
        this.ToasterServiceInstace.ShowError('Something Went wrong.');
      },
    );
  }

  /**
   * This method is used to trigger when user clicks on checkbox of module
   */
  ModuleCheckBoxClicked(event: any, colNum: number) {
    const checkBoxFlag = event.target.checked;
    this.updateRequestObj(checkBoxFlag, colNum);
  }

  /**
   * This method is used to trigger when user clicks on checkbox of claims
   */
  claimsCheckBoxClicked(event: any, rowNum: number, colNum: number) {
    const checkBoxFlag = event.target.checked;
    this.updateRequestObj(checkBoxFlag, colNum, rowNum);
  }

  /**
   * This method is used to update the request object for save API
   */
  updateRequestObj(checkBoxFlag: boolean, colNum: number, rowNum?: number) {
    this.btnDisableFlag = false;
    const selectedRoleObj = this.roleCategoryData[colNum];
    let editedIndex = this.roleCategorySaveReq.findIndex(
      item => item.id === selectedRoleObj.id,
    );
    if (editedIndex === -1) {
      this.roleCategorySaveReq.push(new RoleCategoryReq(selectedRoleObj));
      editedIndex = this.roleCategorySaveReq.length - 1;
    }
    if (checkBoxFlag) {
      if (rowNum >= 0) {
        this.roleCategorySaveReq[editedIndex].mappedClaims.push(
          this.viewModel.claimCategoryData[rowNum].id,
        );
      } else {
        this.roleCategorySaveReq[editedIndex].mappedClaims.push(
          this.parentCategoryId,
        );
      }
    } else {
      // const refVariable = this;
      this.updateRequestRevVariable = this;
      if (rowNum >= 0) {
        this.roleCategorySaveReq[
          editedIndex
        ].mappedClaims = this.roleCategorySaveReq[
          editedIndex
        ].mappedClaims.filter(item => {
          return (
            item !==
            this.updateRequestRevVariable.viewModel.claimCategoryData[rowNum].id
          );
        });
      } else {
        this.roleCategorySaveReq[
          editedIndex
        ].mappedClaims = this.roleCategorySaveReq[
          editedIndex
        ].mappedClaims.filter(item => {
          return item !== this.updateRequestRevVariable.parentCategoryId;
        });
      }
    }
    this.roleCategorySaveReq[
      editedIndex
    ].lastUpdatedBy = this.userProfileService.dataModel.user.ldapAlias;
    this.roleCategorySaveReq[editedIndex].lastUpdatedDateTime = String(
      new Date().toISOString(),
    );
  }
  /**
   * This method is used to trigger subscription
   * to bind selected Category Claims to the table.
   */
  onCategoryChange() {
    this.getClaimCategoryData();
    this.getRolesData();
  }

  /**
   * This method is used to check whether checkbox should be true of false for claims.
   */
  claimsChecked(claimItem: any, roleItem: any) {
    return LO.find(roleItem.mappedClaimsList, item => item.id === claimItem.id);
  }

  /**
   * This method is used to check whether checkbox should be true of false for selected Module.
   */
  ModuleChecked(roleItem: any) {
    return LO.find(
      roleItem.mappedClaimsList,
      item => item.id === this.parentCategoryId,
    );
  }

  /**
   * This method is used to trigger when user clicks on Reset Button.
   */
  cancelBtnClicked() {
    this.viewModel.roleAdminData = [];
    this.roleCategorySaveReq = [];
    // const refVariable = this;
    this.cancelBtnRefVariable = this;
    this.roleCategoryData.forEach(item => {
      this.cancelBtnRefVariable.viewModel.roleAdminData.push(
        new RoleCategoryDataModel(item),
      );
    });
    this.btnDisableFlag = true;
  }

  /**
   * This method is used to trigger when uesr clicks on Save Button.
   */
  saveBtnClicked() {
    this.entitlementService
      .saveSelectedClaims(this.roleCategorySaveReq)
      .subscribe(
        saveCategoryData => {
          if (saveCategoryData) {
            this.ToasterServiceInstace.ShowSuccess('Saved Successfully');
            this.btnDisableFlag = true;
            this.getRolesData();
          } else {
            this.ToasterServiceInstace.ShowError('Something Went wrong.');
          }
        },
        error => {
          this.WriteErrorLog('error in saveSelectedClaims subscribe', error);
          this.ToasterServiceInstace.ShowError('Something Went wrong.');
        },
      );
  }

  /**
   * We are clearing everything here
   */
  ngOnDestroy() {
    this.viewModel = new EntitlementViewModel();
    this.roleCategorySaveReq = [];
    this.roleCategoryData = [];
    this.btnDisableFlag = true;
  }
}
