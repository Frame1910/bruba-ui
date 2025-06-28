import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  constructor() {
    // Initialize tokenExpiry from localStorage if exists
    const expiryStr = localStorage.getItem('tokenExpiry');
    if (expiryStr) {
      this.tokenExpiry = new Date(expiryStr);
    }
  }

  tokenExpiry: Date | null = null;

  login(inviteCode?: string) {
    const code = inviteCode || localStorage.getItem('inviteCode');
    if (!code) {
      console.warn('No invite code provided. Redirecting to sign-in page.');
      this.router.navigate(['/sign-in']);
      return throwError(() => new Error('No invite code provided'));
    }

    return this.apiService.getToken(code).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('inviteCode', code);
        this.tokenExpiry = new Date(response.ttl + Date.now());
        localStorage.setItem('tokenExpiry', this.tokenExpiry.toISOString());
        // console.log('Token received and stored:', response.access_token);
        // console.log('Token expiry set to:', this.tokenExpiry);
      })
    );
  }

  getToken() {
    const token = localStorage.getItem('token');
    const isTokenExpired = this.isTokenExpired();

    if (!token || isTokenExpired) {
      return this.refreshToken();
    }

    return of({ access_token: token });
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;

    // Add a 30-second buffer to account for any timing issues
    const now = new Date();
    now.setSeconds(now.getSeconds() + 30);

    return this.tokenExpiry < now;
  }

  private refreshToken() {
    const inviteCode = localStorage.getItem('inviteCode');
    if (!inviteCode) {
      this.router.navigate(['/sign-in']);
      return throwError(
        () => new Error('No invite code available for token refresh')
      );
    }

    return this.login(inviteCode);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('inviteCode');
    this.tokenExpiry = null;
    this.router.navigate(['/sign-in']);
  }
}
