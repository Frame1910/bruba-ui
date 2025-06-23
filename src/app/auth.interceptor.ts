import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor: Intercepting request:', req.url);
  // Skip authentication for login, metadata, or invite URLs with 6-digit codes
  if (
    req.url.includes('/assets') ||
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/metadata') ||
    /\/api\/invites\/\d{6}$/.test(req.url)
  ) {
    console.log('AuthInterceptor: Skipping authentication for:', req.url);
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the AuthService to get a valid token
  return authService.getToken().pipe(
    catchError((err) => {
      console.error('Failed to get authentication token:', err);
      router.navigate(['/sign-in']);
      return throwError(() => err);
    }),
    switchMap((tokenResponse) => {
      // Clone the request with the token
      const authReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          `Bearer ${tokenResponse.access_token}`
        ),
      });

      // Forward the request with the token
      return next(authReq);
    }),
    catchError((err) => {
      console.error('Authentication error in interceptor:', err);
      router.navigate(['/sign-in']);
      return throwError(() => err);
    })
  );
};
