import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
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
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'T') {
      this.themeService.toggleTheme();
    }
  }

  navItems = [{ name: 'Home', route: ['..'], icon: 'home' }];
  protected readonly isMobile = signal(true);
  readonly themeService = inject(ThemeService);
  randomSource: number | undefined;
  customImageFlag: boolean = false;
  customImage: string | undefined;
  customImageStyling: string | undefined;
  weddingName: string = 'Wedding of Jakub & Brooke';

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
    this.randomSource = Math.floor(Math.random() * 8) + 1; // chooses random imgage
    const inviteCode = localStorage.getItem('inviteCode');
    // if (inviteCode) {
    //   this.navItems.push({
    //     name: 'Manage RSVP',
    //     route: ['invite', inviteCode],
    //     icon: 'mark_email_read',
    //   });
    // }
    this.customBakgroundCheck(inviteCode);
  }

  customBakgroundCheck(inviteCode: string | null) {
    switch (inviteCode) {
      case '172449':
        this.customImage = 'custom-main/breejake.jpg';
        this.customImageStyling = 'object-position: 4%';
        break;
      case '778468':
        this.customImage = 'custom-main/arvin.jpeg'
        this.customImageStyling = 'object-position: 45% 10%';
    }
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
