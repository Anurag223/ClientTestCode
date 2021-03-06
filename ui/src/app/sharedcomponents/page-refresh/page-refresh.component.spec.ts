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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageRefreshComponent } from './page-refresh.component';
import {
  PipeTransform,
  Pipe,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { UserProfileDataModel, Role } from 'src/app/base/models/userprofile';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  BsDropdownModule,
  ButtonsModule,
  PopoverModule,
  PopoverConfig,
} from 'ngx-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpModule } from '@angular/http';
import {
  UserProfileViewModelMock,
  roleMock,
  UserProfileDataModelMock,
} from 'src/mocks/userProfileDataMock.spec';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import { LoggerService } from 'src/app/base/service/logger.service';
import { LogLevel } from 'src/Constants/application';
import { Observable } from 'rxjs';

// *****************   Translate Pipe mock   ************ */

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value) {
    // Do stuff here, if you want
  }
}

// *****************    User profile service mock   ************ */

class UserprofileServiceMock {
  public dataModel: UserProfileDataModel = UserProfileDataModelMock;
  public Rx = require('rxjs/Rx');
  public userRoleObservable = {
    subscribe: () => {
      return new Role(roleMock);
    },
  };
  public getCurrentTransSite(): string[] {
    return ['', ''];
  }

  public saveRefreshIntervalInformation(
    ldap: '',
    appName: '',
    interval: 2,
  ): Observable<any> {
    return this.Rx.Observable.empty();
  }
}

// *****************    Loader service mock   ************ */

class LoggerServiceMock {
  public CurrentLogLevel: LogLevel = 1;
  public WriteDebugLog() {
    return true;
  }
}

describe('PageRefreshComponent', () => {
  let component: PageRefreshComponent;
  let fixture: ComponentFixture<PageRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PageRefreshComponent, TranslatePipeMock],
      imports: [
        BrowserModule,
        CommonModule,
        BsDropdownModule.forRoot(),
        PopoverModule,
        NgMultiSelectDropDownModule.forRoot(),
        ButtonsModule,
        HttpModule,
      ],
      providers: [
        { provide: UserprofileService, useClass: UserprofileServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        PopoverConfig,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRefreshComponent);
    component = fixture.componentInstance;
    component.userProfileViewModel = UserProfileViewModelMock;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should trigger start interval', () => {
    component.userProfileViewModel.data.user.refreshInterval = 2;
    component.startInterval();
    expect(
      component.userProfileViewModel.data.user.refreshInterval,
    ).toBeGreaterThan(0);
  });

  it('should be true', () => {
    component.startWarningTimer();
    expect(component.showWarningFlag).toBe(true);
  });

  it('should be false', () => {
    component.endWarningTimer();
    expect(component.showWarningFlag).toBe(false);
  });

  it('should refresh grid, when refresh function trigger', () => {
    component.refreshData();
    expect(new Date().getMinutes()).toEqual(component.updatedDate.getMinutes());
  });

  it('startInterval should trigger when user change the selected refresh time', () => {
    const selectedrefreshTime = 2;
    component.handleChange(selectedrefreshTime);
  });
});
