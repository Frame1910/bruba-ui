import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { inviteCodeGuard } from './invite-code.guard';

describe('inviteCodeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => inviteCodeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
