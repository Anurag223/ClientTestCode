import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { KendoControlModule } from '../../../base/modules/kendocontrols.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MappingRoutingModule } from './mapping-routing.module';
import { BaseMapperComponent } from './existingmappings/basemapper.component';
import { BaseMapperService } from './existingmappings/basemapper.service';
import { SiteBrowserService } from './sitebrowser/sitebrowser.service';
import { SharedModule } from '../../../sharedcomponents/shared.module';
import { SiteBrowserComponent } from './sitebrowser/sitebrowser.component';
import { GridDateTimeEditComponent } from '../../applicationcontrols/Controls/date-time-picker/date-time-picker.component';
import { FavoriteSearchFilterComponent } from '../../../sharedcomponents/favorite-search-filter/favorite-search-filter.component';


@NgModule({
    declarations: [
        BaseMapperComponent,
        SiteBrowserComponent,
        GridDateTimeEditComponent,
        FavoriteSearchFilterComponent,
    ],
    providers: [
        BaseMapperService,
        SiteBrowserService
    ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    KendoControlModule,
    NgMultiSelectDropDownModule,
    MappingRoutingModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MappingModule {}
