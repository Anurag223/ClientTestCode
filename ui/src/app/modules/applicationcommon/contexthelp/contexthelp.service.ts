import { Injectable } from '@angular/core';
import { DataService } from 'src/app/base/service/data.service';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/base/service/logger.service';
import { FMPHelper } from 'src/Constants/helpers';
import { Observable ,  Subject } from 'rxjs';
import { IContextHelpModel, ContextHelpDataModel, ContextHelpDetails } from '../models/context-help';

@Injectable({
  providedIn: 'root'
})
export class ContextHelpService extends DataService {
  dataModel: ContextHelpDataModel;
  contextSelectionObservable: Subject<ContextHelpDetails>;
  constructor(http: HttpClient, logger: LoggerService) {
    super('ContexthelpService', '', http, logger);
    this.dataModel = new ContextHelpDataModel();
    this.contextSelectionObservable = new Subject<ContextHelpDetails>();
  }

  getContextHelp(language: string): Observable<IContextHelpModel[]> {
    const customurl = `${FMPHelper.ApplicationSettings.languageAPI}/${language}/ContextHelp`;
    return this.selectall<IContextHelpModel[]>(customurl);
  }

  getContextHelpByCode(language: string, contextCode: string): Observable<IContextHelpModel> {
    const customurl = `${FMPHelper.ApplicationSettings.languageAPI}/${language}/ContextHelp/${contextCode}`;
    return this.selectall<IContextHelpModel>(customurl);
  }

  updateContextHelp(language: string, data: IContextHelpModel): Observable<boolean> {
    const customurl = `${FMPHelper.ApplicationSettings.languageAPI}/${language}/ContextHelp`;
    return this.updatepatch<boolean>(data, customurl);
  }
}
