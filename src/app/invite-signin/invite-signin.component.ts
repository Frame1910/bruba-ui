import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Invite } from '../../types';

@Component({
  selector: 'app-invite-signin.component',
  imports: [CommonModule],
  templateUrl: './invite-signin.component.html',
  styleUrl: './invite-signin.component.scss',
})
export class InviteSigninComponentComponent {
  @Input() code: string | undefined;

  invite$: Observable<Invite> | undefined;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (!this.code) {
      return;
    }
    this.invite$ = this.api.getInviteByCode(this.code);
  }
}
