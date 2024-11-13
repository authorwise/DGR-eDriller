import { TestBed } from '@angular/core/testing';

import { MenuHendleService } from './menu-hendle.service';

describe('MenuHendleService', () => {
  let service: MenuHendleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuHendleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
