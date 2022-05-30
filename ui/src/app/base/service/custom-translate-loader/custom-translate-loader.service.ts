import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../logger.service';
import { DataService } from '../data.service';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import { FMPHelper } from 'src/Constants/helpers';

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateLoaderService extends DataService implements TranslateLoader {
  constructor(http: HttpClient, logger: LoggerService, private userService: UserprofileService) {
    super('CustomTranslateLoaderService', FMPHelper.ApplicationSettings.languageAPI, http, logger);
  }
    getTranslation(lang: string): Observable<any> {
        
    const apiAddress = 'assets/i18n/' + lang + '.json';
    return Observable.create(observer => {
        this.selectall(apiAddress).subscribe((res) => {
            observer.next(res);
            observer.complete();
      },
        error => {
          //  failed to retrieve from api, switch to local
          this.selectall(apiAddress).subscribe((res) => {
            observer.next(res);
            observer.complete();
          })
        }
      );
    });
     
  }
}
