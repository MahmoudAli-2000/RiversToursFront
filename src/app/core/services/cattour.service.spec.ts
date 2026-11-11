import { TestBed } from '@angular/core/testing';

import { CattourService } from './cattour.service';

describe('CattourService', () => {
  let service: CattourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CattourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
