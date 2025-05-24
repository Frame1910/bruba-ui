import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const inviteCodeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageKey = 'inviteCode';
  const hasKey = localStorage.getItem(storageKey) !== null;

  if (!hasKey) {
    // Redirect to login or another page if key is missing
    router.navigate(['/invite']);
    return false;
  }

  return true;
};
