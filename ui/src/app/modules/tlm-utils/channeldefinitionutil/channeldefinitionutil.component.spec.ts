import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDefinitionUtilComponent } from './channeldefinitionutil.component';

describe('ChanneldefinitionutilComponent', () => {
  let component: ChannelDefinitionUtilComponent;
  let fixture: ComponentFixture<ChannelDefinitionUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelDefinitionUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelDefinitionUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
