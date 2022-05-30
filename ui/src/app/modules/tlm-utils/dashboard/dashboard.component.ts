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
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { AppTranslateService } from '../../../app.translate.service';
import { LoggerService } from '../../../base/service/logger.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(_loggerService: LoggerService,
    private _AppTranslateService: AppTranslateService) {
    super('DashboardComponent', _loggerService);
  }

  ngOnInit() {
  }

  onLanguageChange(lang) {
    this._AppTranslateService.changeDefaultLanguage(lang);
  }

  onLogLevelChange(logLevel: string) {
    this.SetLogLevel(Number(logLevel));
  }
}
