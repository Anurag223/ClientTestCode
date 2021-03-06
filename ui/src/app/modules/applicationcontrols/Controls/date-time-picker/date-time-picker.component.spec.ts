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

import { GridDateTimeEditComponent } from './date-time-picker.component';
import { KendoControlModule } from 'src/app/base/modules/kendocontrols.module';
import { DatePickerModule, TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { HttpClientModule } from '@angular/common/http';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GridDateTimeEditComponent', () => {
  let component: GridDateTimeEditComponent;
  let fixture: ComponentFixture<GridDateTimeEditComponent>;
  let showPopUp: boolean;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDateTimeEditComponent ],
      imports: [
        BrowserModule,
        CommonModule,
        InputsModule,
        ButtonsModule,
        HttpClientModule,
        SplitterModule,
        TranslateModule.forRoot(),
        KendoControlModule,
        DatePickerModule,
        TimePickerModule,
        PopupModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDateTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    this.showPopUp = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('Set Date/Time values - should hide pop-up and update value', () => {
    component.onSet();
    expect(component.showPopUp).toBeFalsy();
  });
  xit('Cancel Set Date/Time values - should hide pop-up and reset the changes', () => {
    component.onCancel();
    expect(component.showPopUp).toBeFalsy();
  });

  xit('Show Modal popup for Date Time selection', () => {
    component.onDateTimeCellClick();
    expect(component.showPopUp).toBeTruthy();
  });
});
