import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinactiveComponent } from './userinactive.component';
import { HttpClientModule } from '../../../../../../node_modules/@angular/common/http';
import { BaseComponent } from 'src/app/base/component/base/base.component';

describe('UserinactiveComponent', () => {
  let component: UserinactiveComponent;
  let fixture: ComponentFixture<UserinactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserinactiveComponent],
      imports: [
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinactiveComponent);
    component = fixture.componentInstance;
    component.isTimeout = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should not logout from application', () => {
    component.currentLoginTime = Date.now();
    component.MINUTES_UNITL_AUTO_LOGOUT = 2;
    component.check();
    expect(component.isTimeout).toBeFalsy();
  });
});
