import { ClipboardModule } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Invite } from '../../types';
import { ApiService } from '../api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { LocationComponent } from './location/location.component';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { SportsCarnivalComponent } from './sports-carnival/sports-carnival.component';

@Component({
  selector: 'app-main-screen',
  imports: [
    MatCardModule,
    MatButtonModule,
    GoogleMapsModule,
    MatListModule,
    MatIconModule,
    ClipboardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
    LocationComponent,
    AccommodationComponent,
    SportsCarnivalComponent,
  ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
})
export class MainScreenComponent {
  private api = inject(ApiService);

  invite: Invite | undefined;

  ngOnInit() {
    // const code = localStorage.getItem('inviteCode');
    // this.api.getInviteByCode(code!).subscribe((invite) => {
    //   console.log('Got invite data!');
    //   this.invite = invite;
    // });
  }
}
