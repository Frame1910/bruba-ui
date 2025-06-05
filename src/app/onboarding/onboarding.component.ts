import { UserInvite } from './../../types';
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-onboarding',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    RouterModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  @Input() set code(code: string) {
    this.invite$ = this.api.getInvitees(code);
  }
  invite$: Observable<InviteWithUsers> | undefined;
  invite: InviteWithUsers | undefined;
  private _formBuilder = inject(FormBuilder);
  inviteAcceptFormGroup: FormGroup | undefined;
  additionalInfoFormGroup: FormGroup | undefined;
  welcomeMessage: string | undefined;
  isSecondStepReady: boolean = false;

  ngOnInit() {
    if (this.invite$) {
      this.invite$.subscribe((invite) => {
        this.invite = invite;
        console.log(invite);
        if (this.checkInviteStatus(invite)) {
          const group: { [key: string]: any } = {};
          for (let index = 0; index < invite.UserInvite.length; index++) {
            // console.log(userInvite.user.firstName);
            const userInvite = invite.UserInvite[index];
            group[`${userInvite.user.id}`] = ['', Validators.required];
          }
          if (invite.allowPlusOne) {
            group['plusOne'] = ['', Validators.required];
          }
          this.inviteAcceptFormGroup = this._formBuilder.group(group);
        }
        });
        this.additionalInfoFormGroup = this._formBuilder.group({});
    }
  }

  checkInviteStatus(invite: InviteWithUsers) {
    if (invite.UserInvite.some((user) => user.status === 'ACCEPTED')) {
      console.log('user acceptance detected');
      this.router.navigate(['/app']);
      return false;
    } else if (invite.UserInvite.some((user) => user.status === 'PENDING')){
      console.log('Onboarding valid');
      return true;
    } else {
      console.log('invite was previously denied');
      this.router.navigate(['/sign-in']);
      return false;
    }
  }

  generateAdditionalInfoFormGroup() {
    this.isSecondStepReady = true;
    if (
      Object.values(this.inviteAcceptFormGroup!.controls).every(
        (control) => control.value !== '' && control.value !== undefined
      )
    ) {
      const acceptedUsersGroup: { [key: string]: any } = {};
      for (let user in this.inviteAcceptFormGroup!.controls) {
        if (this.inviteAcceptFormGroup!.get(user)?.value == 'True') {
          acceptedUsersGroup[`${user}_email`] = ['', Validators.email];
          acceptedUsersGroup[`${user}_dietary`] = [''];
          acceptedUsersGroup[`${user}_allergies`] = [''];
        }
        if (this.inviteAcceptFormGroup!.get('plusOne')?.value == 'True') {
          acceptedUsersGroup['plusOne_name'] = ['', Validators.required];
          acceptedUsersGroup['plusOne_surname'] = ['', Validators.required];
          acceptedUsersGroup['plusOne_email'] = ['', Validators.required];
          acceptedUsersGroup['plusOne_dietary'] = [''];
          acceptedUsersGroup['plusOne_allergies'] = [''];
        }
      }
      this.additionalInfoFormGroup =
        this._formBuilder.group(acceptedUsersGroup);
    }
  }

  labelConstructor(Invite: InviteWithUsers) {
    const userNames = Invite.UserInvite.map(
      (userInvite) => userInvite.user.firstName
    );
    const label = userNames.join(' and ') + ',';
    return label;
  }

  checkAcceptance(user: UserInvite) {
    return this.inviteAcceptFormGroup?.get(user.user.id)?.value;
  }

  checkPlusOneAcceptance() {
    return this.inviteAcceptFormGroup?.get('plusOne')?.value;
  }

  // TODO: handle plus ones
  inviteDeclinedCheck() {
    if (
      Object.values(this.inviteAcceptFormGroup!.controls).every(
        (control) => control.value === 'False'
      ) ||
      (Object.values(this.inviteAcceptFormGroup!.controls)
        .filter(
          (control) => control !== this.inviteAcceptFormGroup!.get('plusOne')
        )
        .every((control) => control.value === 'False') &&
        this.inviteAcceptFormGroup!.get('plusOne')?.value === 'True')
    ) {
      console.log('No users accepted the invite, marking them as declined');

      const userIds: string[] = [];
      for (let user in this.inviteAcceptFormGroup!.controls) {
        console.log(user);
        userIds.push(user);
      }

      const declinedStatuses = userIds.map((userId) => {
        return { userId, status: 'DECLINED' };
      });
      this.api
        .updateInviteStatuses(declinedStatuses, this.invite!.code)
        .subscribe((res) => {
          console.log('Invites declined successfully');
          this.router.navigate(['/sign-in']);
        });
    }
  }

  // TODO: handle plus ones
  inviteAccepted() {
    const userIds: Array<{ userId: string; status: string }> = [];
    for (let user in this.inviteAcceptFormGroup!.controls) {
      console.log(this.inviteAcceptFormGroup!.get(user)?.value);
      if (this.inviteAcceptFormGroup!.get(user)?.value === 'True') {
        console.log(user);
        userIds.push({userId: user, status: 'ACCEPTED'});
        // prepare additional details payload for api
      } else {
        userIds.push({userId: user, status: 'DECLINED'});
      }
    }
    console.log(userIds)
    this.api
      .updateInviteStatuses(userIds, this.invite!.code)
      .subscribe((res) => {
        console.log('Invites accepted successfully');
        this.router.navigate(['/app']);
      });
  }
}
