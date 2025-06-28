import { InviteWithUsers, Metadata } from './../../../types';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sports-carnival',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DatePipe,
  ],
  templateUrl: './sports-carnival.component.html',
  styleUrl: './sports-carnival.component.scss',
})
export class SportsCarnivalComponent {
  @Input() inviteWithUsers: InviteWithUsers | undefined;
  @Input() metadata: Metadata[] | null = null;
  private api = inject(ApiService);
  private _formBuilder = inject(FormBuilder);
  private _snackbar = inject(MatSnackBar);
  @Output() submitted = new EventEmitter<void>();
  loading = false;

  sportsCarnivalForm: FormGroup | undefined;

  sportsCarnivalGoogleCalendarURL: string =
    environment.sportsCarnivalGoogleCalendarURL;
  sportsCarnivalOutlookCalendarURL: string =
    environment.sportsCarnivalOutlookCalendarURL;

  ngOnInit() {
    if (this.inviteWithUsers) {
      const group: { [key: string]: any } = {};
      for (const user of this.inviteWithUsers.UserInvite) {
        // TODO: Should we allow users that declined the RSVP for the wedding come to the sports carnival?
        let chipStatus = 'PENDING';
        if (user.scstatus === 'ACCEPTED') {
          chipStatus = 'true';
        } else if (user.scstatus === 'DECLINED') {
          chipStatus = 'false';
        }
        group[`${user.userId}`] = [chipStatus, Validators.required];
      }
      this.sportsCarnivalForm = this._formBuilder.group(group);
      // console.log(this.sportsCarnivalRSVP);
    }
  }

  getSportsCarnivalDate() {
    return this.metadata?.find((m) => m.event === 'sportsCarnivalStartTime')
      ?.datetime;
  }
  getSportsCarnivalStartTime() {
    return this.metadata?.find((m) => m.event === 'sportsCarnivalStartTime')
      ?.datetime;
  }
  getSportsCarnivalEndTime() {
    return this.metadata?.find((m) => m.event === 'sportsCarnivalEndTime')
      ?.datetime;
  }
  getSportsCarnivalRSVPDate() {
    return this.metadata?.find((m) => m.event === 'sportsCarnivalRSVPDue')
      ?.datetime;
  }

  sportsCarnivalRSVP() {
    this.loading = true;
    const userIds: Array<{ userId: string; scstatus: string }> = [];
    for (let user in this.sportsCarnivalForm!.controls) {
      if (this.sportsCarnivalForm!.get(user)?.value === 'true') {
        // console.log('user accepted');
        // console.log(user);
        userIds.push({ userId: user, scstatus: 'ACCEPTED' });
      } else {
        // console.log('user declined');
        // console.log(user);
        userIds.push({ userId: user, scstatus: 'DECLINED' });
      }
    }
    this.api
      .updateSportsCarnivalStatuses(userIds, this.inviteWithUsers!.code)
      .subscribe(() => {
        this.loading = false;
        this.submitted.emit();
        // console.log('request complete');
        this._snackbar.open(
          'Sports Carnival RSVP updated successfully!',
          'OK',
          {
            duration: 3000,
          }
        );
      });
  }
}
