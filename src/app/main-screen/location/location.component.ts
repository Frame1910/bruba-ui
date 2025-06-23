import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject, Input } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { DeviceService } from '../../services/device.service';
import { ThemeService } from '../../services/theme.service';
import { Metadata } from '../../../types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-location',
  imports: [
    MatCardModule,
    GoogleMapsModule,
    MatSnackBarModule,
    ClipboardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    DatePipe,
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
  @Input() metadata: Metadata[] | null = null;

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
    colorScheme: 'LIGHT',
  };
  darkMapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    colorScheme: 'DARK',
  };

  copyWeddingAddress() {
    this._snackbar.open('Address copied to clipboard!', undefined, {
      duration: 2000,
    });
    this.clipboard.copy(this.weddingAddress);
  }

  getArrivalTime() {
    return this.metadata?.find((m) => m.event === 'arriveByTime')?.datetime;
  }

  getCeremonyTime() {
    return this.metadata?.find((m) => m.event === 'ceremonyStartTime')
      ?.datetime;
  }
}
