import { TestBed } from '@angular/core/testing';

import { PartculierService } from './partculier.service';

describe('PartculierService', () => {
  let service: PartculierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartculierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
