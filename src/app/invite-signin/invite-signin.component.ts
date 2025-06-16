import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import packageJson from '../../../package.json';

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
    MatProgressBarModule,
  ],
  templateUrl: './invite-signin.component.html',
  styleUrl: './invite-signin.component.scss',
})
export class InviteSigninComponentComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = inject(ApiService);
  loading = false;
  public version: string = packageJson.version;

  codeControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      (control) => {
        const value = control.value ?? '';
        const isValid = /^\d{6}$/.test(value);
        return isValid ? null : { sixDigitNumber: true };
      },
    ],
  });
  invite: Invite | null = null;
  image: string = 'sign-in/birds.jpg';

  ngOnInit() {
    const images = ['sign-in/birds.jpg', 'sign-in/dogs.jpg'];
    this.image = images[Math.floor(Math.random() * images.length)];
    this.http
      .get<{ version: string }>('/assets/package.json')
      .subscribe((pkg) => {
        this.version = pkg.version;
      });
  }

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
          this.router.navigate(['/onboarding', this.codeControl.value]);
          localStorage.setItem('inviteCode', this.codeControl.value);
        }
      });
  }
}
