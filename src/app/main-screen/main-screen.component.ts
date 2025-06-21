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
import { Invite, InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { LocationComponent } from './location/location.component';
import { SportsCarnivalComponent } from './sports-carnival/sports-carnival.component';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatBadgeModule } from '@angular/material/badge';

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
    MatBadgeModule,
  ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
})
export class MainScreenComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  invite: InviteWithUsers | undefined;
  currentTab: number = 0;
  accommodationSubmitted = false;
  sportsCarnivalSubmitted = false;

  ngOnInit() {
    const code = localStorage.getItem('inviteCode');
    this.api
      .getInvitees(code!)
      .pipe(
        switchMap((invite) => {
          this.invite = invite;
          const now = new Date();
          const diffMs = now.getTime() - new Date(this.invite.lastSeenAt!).getTime();
          if (diffMs > 300000) {
            const { UserInvite, ...inviteWithoutUsers } = invite;
            inviteWithoutUsers.lastSeenAt = new Date();
            inviteWithoutUsers.visits = inviteWithoutUsers.visits! + 1;
            this.api
              .updateInvite(this.invite.code, inviteWithoutUsers as Invite)
              .subscribe();
          }

          console.log('Invite data:', this.invite);
          return this.activatedRoute.queryParamMap;
        })
      )
      .subscribe((params) => {
        this.currentTab = parseInt(params.get('tabIndex') || '0', 10);
        console.log('Current tab index:', this.currentTab);
      });
  }

  onAccommodationSubmitted() {
    this.accommodationSubmitted = true;
  }

  checkAccomodationCompletion() {
    if (this.accommodationSubmitted) {
      return '';
    }
    if (this.invite) {
      return this.invite.bustransport === 'PENDING' ? '1' : '';
    } else {
      return '';
    }
  }

  onSportsCarnivalSubmitted() {
    this.sportsCarnivalSubmitted = true;
  }

  checkSportsCarnivalCompletion() {
    if (this.sportsCarnivalSubmitted) {
      return '';
    }
    if (this.invite) {
      if (this.invite.UserInvite.every((user) => user.scstatus !== 'PENDING')) {
        return '';
      } else {
        return this.invite.UserInvite.length;
      }
    } else {
      return '1';
    }
  }
}
