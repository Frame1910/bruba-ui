import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Invite } from '../../types';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-invite-signin.component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './invite-signin.component.html',
  styleUrl: './invite-signin.component.scss',
})
export class InviteSigninComponentComponent {
  private router = inject(Router);
  private api = inject(ApiService);

  codeControl = new FormControl<string>('', { nonNullable: true });
  loading: boolean = false;
  invite: Invite | null = null;

  ngOnInit() {}

  routeToInvite() {
    this.loading = true;
    this.api
      .getInviteByCode(this.codeControl.value)
      .pipe(
        catchError((err) => {
          console.error(err);
          this.loading = false;
          this.codeControl.setErrors({ invalidCode: true });
          return of(null);
        })
      )
      .subscribe((invite) => {
        console.log(invite);
        if (invite) {
          this.invite = invite;
          this.loading = false;
          this.router.navigate(['/invite', this.codeControl.value]);
          localStorage.setItem('inviteCode', this.codeControl.value);
        }
      });
  }
}
