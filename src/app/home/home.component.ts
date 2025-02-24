import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  navItems = [{ name: 'Home', route: ['main'], icon: 'home' }];
  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    const inviteCode = localStorage.getItem('inviteCode');
    if (inviteCode) {
      this.navItems.push({
        name: 'Manage Invite',
        route: ['invite', inviteCode],
        icon: 'mark_email_read',
      });
    }
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
