import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { LocationComponent } from './location/location.component';
import { SportsCarnivalComponent } from './sports-carnival/sports-carnival.component';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

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
  private activatedRoute = inject(ActivatedRoute);
  invite: InviteWithUsers | undefined;
  currentTab: number = 0;

  ngOnInit() {
    const code = localStorage.getItem('inviteCode');
    this.api
      .getInvitees(code!)
      .pipe(
        switchMap((invite) => {
          this.invite = invite;
          return this.activatedRoute.queryParamMap;
        })
      )
      .subscribe((params) => {
        this.currentTab = parseInt(params.get('tabIndex') || '0', 10);
        console.log('Current tab index:', this.currentTab);
      });
  }
}
