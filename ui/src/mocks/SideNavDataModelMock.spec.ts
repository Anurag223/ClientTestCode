import {
    ILayout, ILayoutColumn, LayoutColumn, Layout,
    SideNavDataModel, SideNavViewModel
} from '../app/sharedcomponents/models/sidenav-overlay' ; // 'src/app/sharedcomponents/models/sidenav-overlay';
import { UserProfileMock } from './userProfileDataMock.spec';


export const ILayoutColumnMock: ILayoutColumn = {
    columnId: 1,
    columnName: '',
    fieldName: '',
    disabled: false,
    isDefault: false,
    isLocked: false,
    layoutName: '',
    sequence: 1,
    toolTip: false
};

export const LayoutColumnMock = new LayoutColumn(ILayoutColumnMock);

export const ILayoutMock: ILayout = {
    layoutID: 1,
    layoutName: '',
    userID: '',
    applicationName: '',
    layoutConfigs: [ILayoutColumnMock],
    group: '',
    sort: '',
    filter: ''
};

export const LayoutMock = new Layout(ILayoutMock);

export const SideNavDataModelMock = new SideNavDataModel();
SideNavDataModelMock.ActivityMonitorLayouts = [LayoutMock];
SideNavDataModelMock.PnSLayouts = [LayoutMock];
SideNavDataModelMock.WorkCenterLayouts = [LayoutMock];

export const SideNavViewModelMock = new SideNavViewModel(SideNavDataModelMock);
SideNavViewModelMock.data = SideNavDataModelMock;
SideNavViewModelMock.user = UserProfileMock;
SideNavViewModelMock.application = '';
SideNavViewModelMock.panelHeader = '';
SideNavViewModelMock.showColumnOptions = false;
SideNavViewModelMock.LayoutsInContext = [LayoutMock];
SideNavViewModelMock.selectedLayout = LayoutMock;
SideNavViewModelMock.AllColumns = [LayoutColumnMock];
SideNavViewModelMock.columnOptionsBound = LayoutMock;



