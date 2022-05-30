import {
    Component, OnInit, OnDestroy, 
    ChangeDetectorRef,
    } from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';

import { UserSentimentService } from './usersentiment.service';
import { UserprofileService } from '../../../base/userprofile/userprofile.service';

@Component({
    selector: 'app-usersentiment',
    templateUrl: './usersentiment.component.html',
    styleUrls: []
})
export class UserSentimentComponent extends BaseComponent implements OnInit, OnDestroy {

    userLDAP: string = "";
    modalWindowOpened: boolean = false;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        private userProfileService: UserprofileService,
        public userSentimentService: UserSentimentService,
    )
    {
        super('UserSentimentComponent', loggerService);
    }

    ngOnInit() {
        this.userLDAP = this.userProfileService.dataModel.LDAP;
        this.checkUserSentimentForModal();

    }
    ngAfterViewInit() {
        this.WriteDebugLog('UserSentimentComponent => ngAfterViewInit');
    }
  
    checkUserSentimentForModal() {

    this.userSentimentService.checkForSurvey(this.userLDAP)
        .subscribe(
            incomingSentimentCheckResponse => {
    
                let response: any = incomingSentimentCheckResponse.Data;

                if (response > 0) {
                    this.modalWindowOpened = true;
                    var purl = 'https://slb001.sharepoint.com/sites/UserFeedbackStaging/SiteAssets/coeapp/index.aspx?AppID=2631';
                    // Opening the user sentiment survey page as a popup window
                    var newwindow = window.open(purl, '_blank', 'width=900,height=850,toolbar=0,menubar=0,location=0,top=10,left=25');
                    if (window.focus) { newwindow.focus() }
                }
                else {
                    this.ToasterServiceInstace.ShowInformation('sentiment survey not needed');
                    this.modalWindowOpened = false;
                }
                
            },
            error => {
                this.WriteErrorLog('error in checkUserSentimentForModal subscribe', error);
                this.ToasterServiceInstace.ShowError('Something Went checking sentiment service.');
                this.modalWindowOpened = false;
            },
        );
    }


    /**
     * We are clearing everything here
     */
    ngOnDestroy() {

    }


}

