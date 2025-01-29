/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Invite } from '../../types';

@Component({
  selector: 'app-invite-management.component',
  imports: [CommonModule],
  templateUrl: './invite-management.component.html',
  styleUrl: './invite-management.component.scss',
})
export class InviteManagementComponentComponent {
  private api = inject(ApiService);
  @Input() set code(code: string) {
    this.invite$ = this.api.getInviteByCode(code);
  }

  invite$: Observable<Invite> | undefined;
}
