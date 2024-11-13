import { TestBed } from '@angular/core/testing';

import { GoogleCloundVisionService } from './google-clound-vision.service';

describe('GoogleCloundVisionService', () => {
  let service: GoogleCloundVisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleCloundVisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
