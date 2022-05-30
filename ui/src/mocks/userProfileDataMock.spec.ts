import { UserProfileViewModel, UserProfileDataModel, IUserProfile, IRole, IProfile, ILink,
         Role, UserProfile, ISavedPreference, SavedPreference } from 'src/app/base/models/userprofile';

export const IProfileMock: IProfile = {
    profileId: '',
    competencyProfile: '',
    embargoLocationFlag: false,
    labourHours: '',
    organization: '',
    segment: '',
    workLocation: '',
    siteName: ''
};

export const ILinkMock: ILink = {
    href: '',
    rel: '',
    type: ''
};

export const IRoleMock: IRole = {
    name: '',
    description: '',
    profile: [IProfileMock],
    link: ILinkMock
};

export const roleMock = new Role(IRoleMock);

export const IUserProfileMock: IUserProfile = {
    firstName: '',
    lastName: '',
    ldapAlias: '',
    email: '',
    ginNumber: '',
    active: false,
    activeCMMS: '',
    role: [IRoleMock],
    selectedUserRole: roleMock,
    lastReleaseNoteDismiss:0
};

export const ISavedPreferenceMock: ISavedPreference = {
    unitOfMeasurement: ''
};

export const savedPreferenceMock = new SavedPreference(ISavedPreferenceMock);
savedPreferenceMock.timeZone = '';
savedPreferenceMock.unitOfMeasurement = '';

export const UserProfileMock = new UserProfile(IUserProfileMock);
export const UserProfileDataModelMock = new UserProfileDataModel();
UserProfileDataModelMock.LDAP = '';
UserProfileDataModelMock.user = UserProfileMock;
UserProfileDataModelMock.preference = savedPreferenceMock;


export const UserProfileViewModelMock = new UserProfileViewModel(UserProfileDataModelMock);
UserProfileViewModelMock.data = UserProfileDataModelMock;
UserProfileViewModelMock.roleBound = roleMock;
