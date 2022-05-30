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
import { ExpandCollapseGroupsComponent } from './expand-collapse-groups.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import {
  PopoverModule,
  PopoverConfig,
  ComponentLoaderFactory,
  PositioningService,
} from 'ngx-bootstrap';
import { GridConfigModel } from '../models/sharedmodels';

describe('ExpandCollapseGridgroupsComponent', () => {
  let component: ExpandCollapseGroupsComponent;
  let fixture: ComponentFixture<ExpandCollapseGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), PopoverModule],
      declarations: [ExpandCollapseGroupsComponent],
      providers: [PopoverConfig, ComponentLoaderFactory, PositioningService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandCollapseGroupsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    component.gridModel = new GridConfigModel();
    expect(component).toBeTruthy();
  });
});