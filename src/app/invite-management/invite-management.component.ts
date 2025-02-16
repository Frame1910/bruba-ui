import { User, UserInvite } from './../../types';
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { InviteWithUsers } from '../../types';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invite-management.component',
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
  ],
  templateUrl: './invite-management.component.html',
  styleUrl: './invite-management.component.scss',
})
export class InviteManagementComponentComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  @Input() set code(code: string) {
    this.invite$ = this.api.getInvitees(code);
  }
  invite$: Observable<InviteWithUsers> | undefined;
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl1: ['', Validators.required],
    secondCtrl2: ['', Validators.required],
    secondCtrl3: ['', Validators.required],
  });

  labelConstructor(Invite: InviteWithUsers) {
    const userNames = Invite.UserInvite.map(userInvite => userInvite.user.firstName);
    const label = userNames.join(' and ') + ',';
    return label;
  }

  acceptFlow(): void { //TODO: potentially use this to redirect if the user does not accept the invite
    if (this.firstFormGroup.get('firstCtrl')?.value == 'false') {
      // this.router.navigate(['/']);
      return;
    }
  }
}
