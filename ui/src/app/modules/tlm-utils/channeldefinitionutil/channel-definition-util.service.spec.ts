import { TestBed } from '@angular/core/testing';

import { ChannelDefinitionUtilService } from './channel-definition-util.service';

describe('ChannelDefinitionUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChannelDefinitionUtilService = TestBed.get(ChannelDefinitionUtilService);
    expect(service).toBeTruthy();
  });
});
