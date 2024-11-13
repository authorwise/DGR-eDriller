import { TestBed } from '@angular/core/testing';

import { FlowServiceService } from './flow-service.service';

describe('FlowServiceService', () => {
  let service: FlowServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
