import { inject, Injectable, signal } from '@angular/core';
import { Theme } from '../../types';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT)
  readonly currentTheme = signal<Theme>('light');

  constructor() { }

  toggleTheme() {
    const themes: Theme[] = ['light', 'dark', 'dumb'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  setTheme(theme: Theme) {
    switch (theme) {
      case 'light':
        this.document.documentElement.classList.add('light-mode');
        this.document.documentElement.classList.remove('dark-mode');
        this.document.documentElement.classList.remove('dumb-mode');
        this.currentTheme.set('light');
        break;
      case 'dark':
        this.document.documentElement.classList.add('dark-mode');
        this.document.documentElement.classList.remove('light-mode');
        this.document.documentElement.classList.remove('dumb-mode');
        this.currentTheme.set('dark');
        break;
      case 'dumb':
        this.document.documentElement.classList.add('dumb-mode');
        this.document.documentElement.classList.remove('light-mode');
        this.document.documentElement.classList.remove('dark-mode');
        this.currentTheme.set('dumb');
        break;
    }
  }
}
