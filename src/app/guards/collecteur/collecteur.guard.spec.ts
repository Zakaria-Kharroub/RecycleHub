import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { collecteurGuard } from './collecteur.guard';

describe('collecteurGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => collecteurGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
