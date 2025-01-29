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
@Component({
  selector: 'app-invite-management.component',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './invite-management.component.html',
  styleUrl: './invite-management.component.scss',
})
export class InviteManagementComponentComponent {
  private api = inject(ApiService);
  @Input() set code(code: string) {
    this.invite$ = this.api.getInvitees(code);
  }

  invite$: Observable<InviteWithUsers> | undefined;
}
