import { Injectable, inject, signal } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  readonly isMobile = signal(false);
  private _mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
}
