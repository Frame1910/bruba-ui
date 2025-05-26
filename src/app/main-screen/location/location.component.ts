import { Component, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-location',
  imports: [
    MatCardModule,
    GoogleMapsModule,
    MatSnackBarModule,
    ClipboardModule,
    MatListModule,
    MatIconModule,
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  private clipboard = inject(Clipboard);
  private _snackbar = inject(MatSnackBar);
  weddingDate: Date = environment.weddingDate;
  weddingAddress: string = environment.weddingAddress;
  weddingVenueName: string = environment.weddingVenueName;

  // Latitude & Longitude for the location
  center: google.maps.LatLngLiteral = {
    lat: environment.swingsLatLong.lat,
    lng: environment.swingsLatLong.lng,
  };
  zoom = 12;


  copyWeddingAddress() {
    this._snackbar.open('Address copied to clipboard!', undefined, {
      duration: 2000,
    });
    this.clipboard.copy(this.weddingAddress);
  }

}
