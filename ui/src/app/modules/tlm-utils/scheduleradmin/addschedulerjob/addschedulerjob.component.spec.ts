import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddschedulerjobComponent } from './addschedulerjob.component';

describe('AddschedulerjobComponent', () => {
  let component: AddschedulerjobComponent;
  let fixture: ComponentFixture<AddschedulerjobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddschedulerjobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddschedulerjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
