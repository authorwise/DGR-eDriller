import { TestBed } from '@angular/core/testing';

import { MastercacheService } from './mastercache.service';

describe('MastercacheService', () => {
  let service: MastercacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MastercacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
