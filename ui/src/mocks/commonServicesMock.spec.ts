import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";
import { LogLevel } from "src/Constants/application";
import { UserProfileDataModel, Role } from "src/app/base/models/userprofile";
import { UserProfileDataModelMock, roleMock } from "./userProfileDataMock.spec";

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
    transform(value) {
        // Do stuff here, if you want
    }

}

// *****************    User profile service mock   ************ */

export class UserprofileServiceMock {
    public dataModel: UserProfileDataModel = UserProfileDataModelMock;
    public Rx = require('rxjs/Rx');
    public userRoleObservable = {
        subscribe: () => {
            return new Role(roleMock);
        }
    };
    public getCurrentTransSite(): string[] {
        return ['', ''];
    }
}

// *****************    Logger service mock   ************ */
export class LoggerServiceMock {
    public CurrentLogLevel: LogLevel = 1;
    public WriteDebugLog() {
        return true;
    }
    public WriteError() {
        return true;
    }
}

// *****************    Loader service mock   ************ */
export class LoaderServiceMock {
    public LoadingText = 'Loading';
}
