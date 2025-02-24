import { User, UserInvite } from './../../types';
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
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

  ngOnInit() {
    if (this.invite$) {
      this.invite$.subscribe((invite) => {
        this.invite = invite;
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
      });
    }
  }

  generateAdditionalInfoFormGroup(){
    if (Object.values(this.inviteAcceptFormGroup!.controls).every(control => control.value !== '' && control.value !== undefined)) {
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
      this.additionalInfoFormGroup = this._formBuilder.group(acceptedUsersGroup);
    }
  }

  nullifyAdditionalInfoFormGroup(){
    this.additionalInfoFormGroup = undefined;
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

  acceptFlow() {
    if (Object.values(this.inviteAcceptFormGroup!.controls).every(control => control.value === 'False')
      || (Object.values(this.inviteAcceptFormGroup!.controls).filter(control => control !== this.inviteAcceptFormGroup!.get('plusOne')).every(control => control.value === 'False')
      && this.inviteAcceptFormGroup!.get('plusOne')?.value === 'True')) {
      this.router.navigate(['/']);
      return;
      //TODO: Call API to update invite status to declined
    }

    for (let user in this.inviteAcceptFormGroup!.controls) {
      console.log(user);
      console.log(this.inviteAcceptFormGroup!.get(user)?.value);
    }
  }
}
