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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupContextPipe } from './Pipes/create-group-context/create-group-context.pipe';
import {
  GroupHeaderClassPurePipe,
  GroupHeaderClassImPurePipe,
} from './Pipes/group-header-class/group-header-class.pipe';
import { CreateDirectoryUriPipe } from './Pipes/create-directory-uri/create-directory-uri.pipe';
import { PositionExpandCollpasePipe } from './Pipes/position-expand-collapse/position-expand-collpase.pipe';
import { KendoControlModule } from 'src/app/base/modules/kendocontrols.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationcommentsComponent } from './Controls/applicationcomments/applicationcomments.component';
import { CheckClaimPipe } from './Pipes/authorization-claim-role/check-claim.pipe';
import { NgxBootStrapModule } from 'src/app/base/modules/ngxbootstrap.module';
import { SafeHtmlPipe } from 'src/app/modules/applicationcontrols/Pipes/safe-html/safe-html.pipe';
import { RepositionElementDirective } from './Directives/reposition-element/reposition-element.directive';
import { ContextHelpElementDirective } from './Directives/context-help-element/context-help-element.directive';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    KendoControlModule,
  ],
  declarations: [
    CreateGroupContextPipe,
    GroupHeaderClassPurePipe,
    GroupHeaderClassImPurePipe,
    CreateDirectoryUriPipe,
    PositionExpandCollpasePipe,
    ApplicationcommentsComponent,
    CheckClaimPipe,
    SafeHtmlPipe,
    RepositionElementDirective,
    ContextHelpElementDirective,
  ],
  exports: [
    CreateGroupContextPipe,
    GroupHeaderClassPurePipe,
    GroupHeaderClassImPurePipe,
    CreateDirectoryUriPipe,
    PositionExpandCollpasePipe,
    ApplicationcommentsComponent,
    CheckClaimPipe,
    SafeHtmlPipe,
    RepositionElementDirective,
    ContextHelpElementDirective,
  ],
})
export class ApplicationControlsModule {}
