import { InviteWithUsers } from './../../../types';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';

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
  ],
  templateUrl: './sports-carnival.component.html',
  styleUrl: './sports-carnival.component.scss'
})
export class SportsCarnivalComponent {
  @Input() inviteWithUsers: InviteWithUsers | undefined;
  private api = inject(ApiService);
  private _formBuilder = inject(FormBuilder);

  sportsCarnivalForm: FormGroup | undefined;

  sportsCarnivalGoogleCalendarURL: string = environment.sportsCarnivalGoogleCalendarURL;
  sportsCarnivalOutlookCalendarURL: string = environment.sportsCarnivalOutlookCalendarURL;

  ngOnInit(){
    if(this.inviteWithUsers){
      const group: { [key: string]: any } = {};
      for (const user of this.inviteWithUsers.UserInvite){
        // TODO: Should we allow users that declined the RSVP for the wedding come to the sports carnival?
        group[`${user.userId}`] = ['', Validators.required];
      }
      this.sportsCarnivalForm = this._formBuilder.group(group);
      console.log(this.sportsCarnivalRSVP)
    }
  }

  sportsCarnivalRSVP(){
    const userIds: Array <{ userId: string; scstatus: string}> = [];
    for (let user in this.sportsCarnivalForm!.controls) {
      if (this.sportsCarnivalForm!.get(user)?.value === 'true'){
        console.log('user accepted')
        console.log(user)
        userIds.push({userId: user, scstatus: 'ACCEPTED'})
      }
      else {
        console.log('user declined')
        console.log(user)
        userIds.push({userId: user, scstatus: 'DECLINED'})
      }
    }
    this.api.updateSportsCarnivalStatuses(userIds, this.inviteWithUsers!.code).subscribe(() => {
      console.log('request complete')
    })
  }
}
