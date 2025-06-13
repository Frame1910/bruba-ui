import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './api.service';
import { catchError, map, of } from 'rxjs';

export const inviteCodeGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const router = inject(Router);
  const inviteCode = localStorage.getItem('inviteCode');

  if (!inviteCode) {
    console.warn('No invite code found in local storage');
    router.navigate(['/sign-in']);
    return false;
  }
  return api.getUserInviteStatus(inviteCode).pipe(
    map((response: any) => {
      const users = response.users || [];
      if (users.length === 0) {
        router.navigate(['/sign-in']);
        return false;
      }
      if (users.every((u: any) => u.status === 'PENDING')) {
        router.navigate([`/onboarding/${inviteCode}`]);
        return false;
      }
      if (users.every((u: any) => u.status === 'DECLINED')) {
        router.navigate([`/declined`]);
        return false;
      }
      return true; // Allow navigation if user is ACCEPTED
    }),
    catchError((err) => {
      // Handle 404 or any error
      router.navigate(['/sign-in']);
      return of(false);
    })
  );
};
