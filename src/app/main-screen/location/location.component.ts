import { Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


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
  zoom = 8;

  mapDisplayOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    gestureHandling: 'none',
  };

  copyWeddingAddress() {
    this._snackbar.open('Address copied to clipboard!', undefined, {
      duration: 2000,
    });
    this.clipboard.copy(this.weddingAddress);
  }

}
