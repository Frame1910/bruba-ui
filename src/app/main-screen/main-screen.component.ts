import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Invite } from '../../types';
import { ApiService } from '../api.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-main-screen',
  imports: [
    MatCardModule,
    MatButtonModule,
    GoogleMapsModule,
    MatListModule,
    MatIconModule,
    DatePipe,
    ClipboardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
})
export class MainScreenComponent {
  private clipboard = inject(Clipboard);
  private _snackbar = inject(MatSnackBar);
  private api = inject(ApiService);
  private router = inject(Router);
  weddingDate: Date = environment.weddingDate;
  weddingAddress: string = environment.weddingAddress;
  weddingVenueName: string = environment.weddingVenueName;

  invite: Invite | undefined;

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

  ngOnInit() {
    const code = localStorage.getItem('inviteCode');
    this.api.getInviteByCode(code!).subscribe((invite) => {
      console.log('Got invite data!');
      this.invite = invite;
    });
  }

  copyWeddingAddress() {
    this._snackbar.open('Address copied to clipboard!', undefined, {
      duration: 2000,
    });
    this.clipboard.copy(this.weddingAddress);
  }
}
