import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Invite } from '../types';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ui';

  invite$: Observable<Invite> | undefined;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.invite$ = this.api.getInviteByCode('000000');
  }
}
