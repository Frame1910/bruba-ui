import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Invite } from '../../types';

@Component({
  selector: 'app-invite-signin.component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invite-signin.component.html',
  styleUrl: './invite-signin.component.scss',
})
export class InviteSigninComponentComponent {
  private router = inject(Router);
  codeControl = new FormControl<string>('', { nonNullable: true });
  invite$: Observable<Invite> | undefined;

  routeToInvite() {
    console.log('Navigating to invite...');
    localStorage.setItem('inviteCode', this.codeControl.value);
    this.router.navigate(['/invite', this.codeControl.value]);
  }
}
