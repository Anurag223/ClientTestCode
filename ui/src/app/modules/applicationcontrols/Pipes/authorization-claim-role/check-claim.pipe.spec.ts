import { CheckClaimPipe } from './check-claim.pipe';
import { BrowserModule} from '@angular/platform-browser';
import {TestBed,inject } from '@angular/core/testing';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
xdescribe('AuthorizationClaimRolePipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule,UserprofileService
        ]
      });
  });
  it('create an instance',  inject([UserprofileService],(UserprofileService) => {
    const pipe = new CheckClaimPipe(UserprofileService);
    expect(pipe).toBeTruthy();
  }));
});
