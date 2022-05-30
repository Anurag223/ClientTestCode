import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardWorkComponent } from './standardwork.component';

describe('StandardWorkComponent', () => {
  let component: StandardWorkComponent;
  let fixture: ComponentFixture<StandardWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
