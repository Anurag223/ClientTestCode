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
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { FMPHelper } from 'src/Constants/helpers';

if (!(FMPHelper.ApplicationSettings.IsLocal)) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then((ref: NgModuleRef<AppModule>) => {
    FMPHelper.AngularInjector = ref.injector;
  })
  .catch(err => console.log(err));