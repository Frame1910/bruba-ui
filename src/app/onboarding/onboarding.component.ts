import { User, UserInvite } from './../../types';
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input, OnInit } from '@angular/core';
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
import { lastValueFrom, Observable } from 'rxjs';
import { InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
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
    MatDialogModule,
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
  private dialog = inject(MatDialog);
  plusOneId: string | undefined;

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
            //Create ID for plus one
            this.plusOneId =
              'plusOne-' + Math.random().toString(36).substring(2, 15);
            group[`${this.plusOneId}`] = ['', Validators.required];
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
    } else if (invite.UserInvite.some((user) => user.status === 'PENDING')) {
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
        if (
          this.inviteAcceptFormGroup!.get(`${this.plusOneId}`)?.value == 'True'
        ) {
          acceptedUsersGroup[`${this.plusOneId}_name`] = [
            '',
            Validators.required,
          ];
          acceptedUsersGroup[`${this.plusOneId}_surname`] = [
            '',
            Validators.required,
          ];
          acceptedUsersGroup[`${this.plusOneId}_email`] = [
            '',
            Validators.required,
          ];
          acceptedUsersGroup[`${this.plusOneId}_dietary`] = [''];
          acceptedUsersGroup[`${this.plusOneId}_allergies`] = [''];
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
    return this.inviteAcceptFormGroup?.get(`${this.plusOneId}`)?.value;
  }

  //check if all users declined as well as if the user declined but said yes for a plus one
  handleNext(stepper: any) {
    if (
      Object.values(this.inviteAcceptFormGroup!.controls).every(
        (control) => control.value === 'False'
      ) ||
      (Object.values(this.inviteAcceptFormGroup!.controls)
        .filter(
          (control) => control !== this.inviteAcceptFormGroup!.get(`${this.plusOneId}`)
        )
        .every((control) => control.value === 'False') &&
        this.inviteAcceptFormGroup!.get(`${this.plusOneId}`)?.value === 'True')
    ) {
      this.confirmDialog();
      return;
    }
    this.generateAdditionalInfoFormGroup();
    stepper.next();
  }

  confirmDialog() {
    this.dialog.open(DeclineDialogComponent, {
      data: {
        inviteAcceptFormGroup: this.inviteAcceptFormGroup,
        invite: this.invite,
      },
    });
  }

  async inviteAccepted() {
    const userIds: Array<{ userId: string; status: string }> = [];
    for (let user in this.inviteAcceptFormGroup!.controls) {
      console.log(this.inviteAcceptFormGroup!.get(user)?.value);
      if (
        this.inviteAcceptFormGroup!.get(user)?.value === 'True' &&
        !user.includes('plusOne')
      ) {
        console.log(user);
        userIds.push({ userId: user, status: 'ACCEPTED' });
        // prepare additional details payload for api
      } else if (
        this.inviteAcceptFormGroup!.get(user)?.value === 'True' &&
        user.includes('plusOne')
      ) {
        console.log('theres a plus one!');
        console.log(this.additionalInfoFormGroup!.get(user));
        const newUser: User = {
          id: user,
          firstName: this.additionalInfoFormGroup?.value[`${user}_name`],
          lastName: this.additionalInfoFormGroup?.value[`${user}_surname`],
          mobile: '',
          email: this.additionalInfoFormGroup?.value[`${user}_email`],
          status: 'ACTIVE',
          relation: 'FRIEND',
          dietary: [],
          createdAt: '',
          updatedAt: '',
        };
        await lastValueFrom(this.api.createUser(newUser));
        console.log('new user created');
        await lastValueFrom(
          this.api.addPlusOne(
            { userId: user, isPlusOne: true },
            this.invite!.code
          )
        );
        console.log('plus one added to invite');
        userIds.push({ userId: user, status: 'ACCEPTED' });
        console.log(userIds);
        console.log('plus one set to accepted');
      } else {
        if (
          this.inviteAcceptFormGroup!.get(user)?.value === 'False' &&
          !user.includes('plusOne')
        ) {
          userIds.push({ userId: user, status: 'DECLINED' });
        }
      }
    }
    console.log(userIds);
    await lastValueFrom(
      this.api.updateInviteStatuses(userIds, this.invite!.code)
    );
  }
}

@Component({
  selector: 'decline-dialog',
  template: `
    <!-- <h2 mat-dialog-title>We're sorry to see you go!</h2> -->
    <mat-dialog-content>
      <img
        src="https://static.wikia.nocookie.net/a17a4745-1891-41e5-908b-ff2b6defa889/scale-to-width/755"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close (click)="declineInvite()">
        Yeah
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeclineDialogComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  inviteAcceptFormGroup: FormGroup | undefined;
  invite: InviteWithUsers | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.inviteAcceptFormGroup = data.inviteAcceptFormGroup;
    this.invite = data.invite;
  }

  declineInvite() {
    console.log('No users accepted the invite, marking them as declined');
    const userIds: string[] = [];
    for (let user in this.inviteAcceptFormGroup!.controls) {
      if (
        this.inviteAcceptFormGroup!.get(user)?.value === 'False' &&
        !user.includes('plusOne')
      ) {
        console.log(user);
        userIds.push(user);
      }
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
