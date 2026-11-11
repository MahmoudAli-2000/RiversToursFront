import { TestBed } from '@angular/core/testing';

import { DestnatoinService } from './destnatoin.service';

describe('DestnatoinService', () => {
  let service: DestnatoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestnatoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
