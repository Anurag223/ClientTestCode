import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EntitlementComponent } from './entitlement/entitlement.component';
import { EntitlementService } from './entitlement/entitlement.service';
import { KendoControlModule } from '../../base/modules/kendocontrols.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    BrowserModule,
    HttpClientModule,
    KendoControlModule,
    NgMultiSelectDropDownModule,
  ],
  declarations: [EntitlementComponent],
  providers: [EntitlementService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdministrationModule {}
