import { TestBed } from '@angular/core/testing';
import { ContexthelpService } from './contexthelp.service';
import { HttpClientModule } from '@angular/common/http';

describe('ContexthelpService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: ContexthelpService = TestBed.get(ContexthelpService);
    expect(service).toBeTruthy();
  });
});
