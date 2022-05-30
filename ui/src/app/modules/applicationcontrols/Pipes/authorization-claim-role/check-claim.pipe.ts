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

import { Pipe, PipeTransform } from '@angular/core';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import { UserProfileDataModel } from 'src/app/base/models/userprofile';
import { FMPHelper } from 'src/Constants/helpers';

@Pipe({
  name: 'checkClaim'
})
export class CheckClaimPipe implements PipeTransform {

  private userProfileViewModel: UserProfileDataModel;
  constructor(private _userProfileService: UserprofileService) {
    this.userProfileViewModel = this._userProfileService && this._userProfileService.dataModel ?
      this._userProfileService.dataModel : null;
  }

  transform(claim: string): boolean {
    let isClaimExist = false;
    if (claim) {
      if (this.userProfileViewModel && this.userProfileViewModel.user &&
        this.userProfileViewModel.user.selectedUserRole &&
        this.userProfileViewModel.user.selectedUserRole.claims) {
        // this.userProfileViewModel.user.selectedUserRole.claims.forEach( object => {
        //   if (FMPHelper.StringEqual(object.code, claim)) {
        //     isClaimExist = true;
        //   }
        // });
        isClaimExist = this.userProfileViewModel.user.selectedUserRole.claims.some(o => FMPHelper.StringEqual(o.code, claim));
      }
    }
    return isClaimExist;
  }
}
