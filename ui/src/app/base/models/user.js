'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// export interface IUserProfile {
//     ldapAlias: string;
//     firstName: string;
//     lastName: string;
//     ginNumber: number;
//     email: string;
//     active: boolean;
//     refreshInterval: number;
//     role: IRole[];
// }
// export interface IUserProfiles {
//     userProfiles: IUserProfile[];
// }
// export interface IProfile {
//     competencyProfile: string;
//     embargoLocationFlag: boolean;
//     labourHouse: number;
//     organization: string;
//     profile: string;
//     segment: string;
//     workLocation: string;
//     activeCMMS: string;
// }
// export interface IRole {
//     name: string;
//     description: string;
//     activeCMMS: string;
//     profiles: IProfile[];
// }
// export interface IUserPreference {
//     profileID: number;
//     userID: string;
//     lastApplicationName: string;
//     roleName: string;
//     activeLocations: string;
//     isActive: boolean;
//     refreshInterval: number;
// }
// export class UserPreference {
//     profileID: number;
//     userID: string;
//     lastApplicationName: string;
//     roleName: string;
//     activeLocations: string;
//     isActive: boolean;
//     constructor(_preference: IUserPreference) {
//         this.profileID = _preference.profileID;
//         this.userID = _preference.userID;
//         this.lastApplicationName = _preference.lastApplicationName;
//         this.roleName = _preference.roleName;
//         this.activeLocations = _preference.activeLocations;
//         this.isActive = _preference.isActive;
//     }
// }
// export class UserProfile implements IUserProfile {
//     constructor(_user: IUserProfile) {
//         this.firstName = _user.firstName;
//         this.lastName = _user.lastName;
//         this.ldapAlias = _user.ldapAlias;
//         this.email = _user.email;
//         this.ginNumber = _user.ginNumber;
//         this.active = _user.active;
//         this.refreshInterval = _user.refreshInterval;
//         if (_user.role)
//             this.role = _user.role.map(r => new Role(r));
//     }
//     firstName: string;
//     lastName: string;
//     ldapAlias: string;
//     email: string;
//     ginNumber: number;
//     active: boolean;
//     refreshInterval: number;
//     role: Role[];
//     userProfilePreferences: UserPreference;
//     selectRole(_role: Role) {
//         // Intially Make all roles as false and then the selected one true.
//         this.role.forEach(r => r.isSelected = false);
//         _role.isSelected = true;
//     }
//     get seletedRole(): Role {
//         const currRole = this.role.find(r => r.isSelected === true);
//         return currRole ? currRole : this.role[0];
//     }
// }
// export class Role implements IRole {
//     constructor(_role: IRole) {
//         if (_role) {
//             this.name = _role.name;
//             this.description = _role.description;
//             this.activeCMMS = _role.activeCMMS;
//             if (_role.profiles) {
//                 this.profiles = _role.profiles.map(p => new Profile(p));
//             }
//         }
//     }
//     name: string;
//     description: string;
//     activeCMMS: string;
//     profiles: Profile[];
//     isSelected = false;
//     get getSelectedtWorkLocationName(): string {
//         return this.seletedWorkLocations.length > 1 ? 'Multiple' :
//             (this.seletedWorkLocations.length === 1 ? this.seletedWorkLocations[0].workLocation : this.profiles[0].workLocation);
//     }
//     get hasSelectedWorkLocation(): boolean {
//         return LO.some<Profile>(this.profiles, p => p.isSelected);
//     }
//     get seletedWorkLocations(): Profile[] {
//         return LO.filter<Profile>(this.profiles, p => p.isSelected);
//     }
// }
// export class Profile implements IProfile {
//     constructor(_profile: IProfile) {
//         this.competencyProfile = _profile.competencyProfile;
//         this.embargoLocationFlag = _profile.embargoLocationFlag;
//         this.labourHouse = _profile.labourHouse;
//         this.organization = _profile.organization;
//         this.profile = _profile.profile;
//         this.segment = _profile.segment;
//         this.workLocation = _profile.workLocation;
//         this.activeCMMS = _profile.activeCMMS;
//     }
//     competencyProfile: string;
//     embargoLocationFlag: boolean;
//     labourHouse: number;
//     organization: string;
//     profile: string;
//     segment: string;
//     workLocation: string;
//     activeCMMS: string;
//     isSelected: boolean;
// }
// export class UserRoleSiteDataModel {
//     userID: string;
//     roleName: string;
//     activeLocations: string;
//     refreshInterval: number;
//     userProfiles: IUserProfile[] = [];
// }
// export class UserRoleSiteViewModel {
//     constructor(_data: UserRoleSiteDataModel) {
//         this.data = _data;
//     }
//     public data: UserRoleSiteDataModel;
// }
// export class UserProfileDataModel {
//     public user: UserProfile;
// }
// export class UserProfileViewModel {
//     constructor(_data: UserProfileDataModel) {
//         this.data = _data;
//     }
//     public roleBound: Role;
//     public data: UserProfileDataModel;
// }
//# sourceMappingURL=user.js.map
