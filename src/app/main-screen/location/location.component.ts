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
import { ThemeService } from '../../services/theme.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceService } from '../../services/device.service';

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
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent {
  readonly deviceService = inject(DeviceService);
  readonly themeService = inject(ThemeService);
  private clipboard = inject(Clipboard);
  private _snackbar = inject(MatSnackBar);
  weddingDate: Date = environment.weddingDate;
  weddingAddress: string = environment.weddingAddress;
  weddingVenueName: string = environment.weddingVenueName;
  googleCalendarURL: string = environment.googleCalendarURL;
  outlookCalendarURL: string = environment.outlookCalendarURL;

  // Latitude & Longitude for the location
  center: google.maps.LatLngLiteral = {
    lat: environment.swingsLatLong.lat,
    lng: environment.swingsLatLong.lng,
  };
  zoom = 12;

  // Map options for light and dark themes
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    colorScheme: 'LIGHT'
  };
  darkMapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    colorScheme: 'DARK'
  };

  copyWeddingAddress() {
    this._snackbar.open('Address copied to clipboard!', undefined, {
      duration: 2000,
    });
    this.clipboard.copy(this.weddingAddress);
  }
}
