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
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // private messageSource = new BehaviorSubject(false);
  // currentMessage = this.messageSource.asObservable();
  // public groupingOtions: GroupDescriptor[];
  // public sortingOptions: SortDescriptor[] = [];
  // public filteringOptions: CompositeFilterDescriptor;
  // public currentLayout: string;
  // public lockOptions: number[];
  public indexGroping: number;
  public userLdap:string;
  constructor() { }


  // togglePane(isOpen: boolean) {
  //   // this.messageSource.next(isOpen)
  // }
}