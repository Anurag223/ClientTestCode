import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateschedulerjobComponent } from './updateschedulerjob.component';

describe('UpdateschedulerjobComponent', () => {
  let component: UpdateschedulerjobComponent;
  let fixture: ComponentFixture<UpdateschedulerjobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateschedulerjobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateschedulerjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
