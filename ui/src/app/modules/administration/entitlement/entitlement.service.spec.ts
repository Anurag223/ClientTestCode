import { TestBed } from '@angular/core/testing';

import { EntitlementService } from './entitlement.service';

xdescribe('EntitlementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntitlementService = TestBed.get(EntitlementService);
    expect(service).toBeTruthy();
  });
});
