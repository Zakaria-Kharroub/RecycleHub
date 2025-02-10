import { TestBed } from '@angular/core/testing';

import { CollecteurService } from './collecteur.service';

describe('CollecteurService', () => {
  let service: CollecteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollecteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
