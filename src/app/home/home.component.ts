import { Component, inject, OnDestroy, OnInit, signal, ElementRef } from '@angular/core';
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
  randomSource: number | undefined;
  customImageFlag: boolean = false;
  customImage: string | undefined;

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  constructor(private el: ElementRef) {
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  scrollToContent() {
    const contentElement = this.el.nativeElement.querySelector('#content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
    this.randomSource = Math.floor(Math.random() * 5) + 1; // chooses random imgage
    const inviteCode = localStorage.getItem('inviteCode');
    if (inviteCode) {
      this.navItems.push({
        name: 'Manage RSVP',
        route: ['invite', inviteCode],
        icon: 'mark_email_read',
      });
    }
    this.customBakgroundCheck(inviteCode);
  }

  customBakgroundCheck(inviteCode: string | null){
    switch (inviteCode) {
      case '111111':
        this.customImage = 'custom-main/breejake.jpg';
        break;
    }
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
