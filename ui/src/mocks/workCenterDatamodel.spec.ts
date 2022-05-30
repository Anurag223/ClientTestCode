import {
  WorkCenterDataModel,
  IUsers,
  Users,
  IColumnLayout,
  ColumnLayout,
  IWcRelSite,
  WorkCenterViewModel,
  IWorkcenter,
  SiteData,
  ISiteData,
} from '../app/modules/p-n-s/workcenter/models/workcenter/workcenter';
import { IProfile, Profile } from '../app/base/models/userprofile';
import { WorkStationScheduler } from 'src/app/modules/p-n-s/workcenter/models/workstation/workstation';
import { of } from 'rxjs';

export const IProfileMock: IProfile = {
  profileId: '',
  competencyProfile: '',
  embargoLocationFlag: false,
  labourHours: '',
  organization: '',
  segment: '',
  workLocation: '',
  siteName: '',
};

export const ProfileMock = new Profile(IProfileMock);

export const IUsersMock: IUsers = {
  Employee_No: 1,
  LDAP_Alias: '',
  First_Name: '',
  Last_Name: '',
  JobCodeHRIS: 1,
  Country: '',
  Role_ID: 1,
  Role_Name: '',
  SWC: '',
};

export const UsersMock = new Users(IUsersMock);

export const IColumnLayoutMock: IColumnLayout = {
  userProfileID: 1,
  applicationName: '',
  layoutName: '',
  isDefault: false,
  disabled: false,
  columnId: 1,
  columnName: '',
  isLocked: false,
  sequence: 1,
  toolTip: '',
  layoutConfigs: [],
};

export const ColumnLayoutMock = new ColumnLayout(IColumnLayoutMock);

export const IWcRelSiteMock: IWcRelSite = {
  Id: 1,
  acc_Unit: '',
  employee_No: 1,
  acc_Unit_Desc: '',
};

export const IWorkcenterMock: IWorkcenter = {
  Acc_Unit: 1,
  Acc_Unit_Desc: '',
};

export const WorkCenterDataModelMock = new WorkCenterDataModel();
WorkCenterDataModelMock.allSites = [ProfileMock];
WorkCenterDataModelMock.wcSelectedSiteUsers = [UsersMock];
WorkCenterDataModelMock.allColumnLayouts = [ColumnLayoutMock];
WorkCenterDataModelMock.allWorkCenterUsersRel = [IWcRelSiteMock];

export const WorkCenterViewModelMock = new WorkCenterViewModel(
  WorkCenterDataModelMock,
);
WorkCenterViewModelMock.data = WorkCenterDataModelMock;
WorkCenterViewModelMock.selectedSite = ProfileMock;
WorkCenterViewModelMock.assignedCenterOptions = [ProfileMock];
WorkCenterViewModelMock.assignedCenterOptionsBound = [ProfileMock];
WorkCenterViewModelMock.defaultColumns = [];
WorkCenterViewModelMock.isColumnOptionsOpening = false;

export const isiteDataMock: ISiteData = {
  id: 1,
  name: 'xyz',
  scheduler: new WorkStationScheduler(null),
  isActive: true,
  createdBy: 232345,
  createdDateTime: 'asdf',
  lastUpdatedBy: 234567,
  lastUpdatedDateTime: '1/15/2019 3:03 PM',
  type: 1,
};

export const siteDataMock: SiteData = new SiteData(isiteDataMock);

export function fakeSubscribe(returnValue, errorValue) {
  return {
    subscribe(callback, error) {
      callback(returnValue);
      error(errorValue);
    },
  };
}

export class MockWorkcenterService {
  public siteChangeSubject = {
    subscribe: () => {
      return of(ProfileMock);
    },
  };

  public siteChangeDataSubject = {
    subscribe: () => {
      return of(siteDataMock);
    },
  };

  // new Subject<Profile>();
  getWorkCenters() {
    const workcenter = [
      {
        Acc_Unit: '1535260',
        Acc_Unit_Desc: 'BRC1-TREW1',
      },
      {
        Acc_Unit: '1530605',
        Acc_Unit_Desc: 'GBC1-TREW1',
      },
      {
        Acc_Unit: '1533918',
        Acc_Unit_Desc: 'IDCE-TREW1',
      },
    ];
    return fakeSubscribe(workcenter, 0);
  }

  getUsers() {
    const userResponse = [
      {
        Employee_No: 1,
        LDAP_Alias: 'string',
        First_Name: 'string',
        Last_Name: 'string',
        JobCodeHRIS: 1,
        Country: 'string',
        Role_ID: 1,
        Role_Name: 'string',
        SWC: 'string',
        WorkCenter: 'string',
      },
    ];
    return fakeSubscribe(userResponse, 0);
  }

  getWC_Rel_site() {
    const wc_rel_site = [
      {
        employee_No: 1,
        acc_Unit_Desc: 'string',
      },
    ];
    return fakeSubscribe(wc_rel_site, 0);
  }

  unAssignedWorkCenter() {
    const userUnAssignResponse = [
      {
        Employee_No: 1,
        LDAP_Alias: 'string',
        First_Name: 'string',
        Last_Name: 'string',
        JobCodeHRIS: 1,
        Country: 'string',
        Role_ID: 1,
        Role_Name: 'string',
        SWC: 'string',
        WorkCenter: 'string',
      },
    ];
    return fakeSubscribe(userUnAssignResponse, 0);
  }

  assignedWorkCenter() {
    const userAssignResponse = [
      {
        Employee_No: 1,
        LDAP_Alias: 'string',
        First_Name: 'string',
        Last_Name: 'string',
        JobCodeHRIS: 1,
        Country: 'string',
        Role_ID: 1,
        Role_Name: 'string',
        SWC: 'string',
        WorkCenter: 'string',
      },
    ];
    return fakeSubscribe(userAssignResponse, 0);
  }
}
