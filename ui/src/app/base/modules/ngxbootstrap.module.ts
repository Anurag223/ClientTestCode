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
import { AccordionModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap';
import { CollapseModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap';
import { RatingModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  declarations: [],
  providers: [],
  exports: [
    AccordionModule,
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    ModalModule,
    PopoverModule,
    ProgressbarModule,
    RatingModule,
    TooltipModule,
    TypeaheadModule,
  ]
})
export class NgxBootStrapModule { }
