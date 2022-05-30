import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnOptionsDropdownComponent } from './column-options-dropdown.component';

describe('ColumnOptionsDropdownComponent', () => {
  let component: ColumnOptionsDropdownComponent;
  let fixture: ComponentFixture<ColumnOptionsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnOptionsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnOptionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
