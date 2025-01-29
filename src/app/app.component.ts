import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { Invite } from '../types';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ui';
  environment: string = environment.production ? 'production' : 'development';

  invite$: Observable<Invite> | undefined;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.invite$ = this.api.getInviteByCode('000000');
  }
}
