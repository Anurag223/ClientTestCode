'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
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
var testing_1 = require('@angular/core/testing');
var config_component_1 = require('./config.component');
var http_1 = require('@angular/common/http');
describe('ConfigComponent', function() {
  var component;
  var fixture;
  beforeEach(
    testing_1.async(function() {
      testing_1.TestBed.configureTestingModule({
        imports: [http_1.HttpClientModule],
        declarations: [config_component_1.ConfigComponent],
      }).compileComponents();
    }),
  );
  beforeEach(function() {
    fixture = testing_1.TestBed.createComponent(
      config_component_1.ConfigComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', function() {
    expect(component).toBeTruthy();
  });
});
//# sourceMappingURL=config.component.spec.js.map
