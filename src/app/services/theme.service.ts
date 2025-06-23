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
    const themes: Theme[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  setTheme(theme: Theme) {
    switch (theme) {
      case 'light':
        this.document.documentElement.classList.add('light-mode');
        this.document.documentElement.classList.remove('dark-mode');
        this.currentTheme.set('light');
        localStorage.setItem('theme', theme);
        break;
      case 'dark':
        this.document.documentElement.classList.add('dark-mode');
        this.document.documentElement.classList.remove('light-mode');
        this.currentTheme.set('dark');
        localStorage.setItem('theme', theme);
        break;
    }
  }

  comicSansToggle(){
    if (this.document.documentElement.classList.contains('comic-sans-font')) {
      this.document.documentElement.classList.remove('comic-sans-font');
      localStorage.removeItem('comicSans');
    } else {
      this.document.documentElement.classList.add('comic-sans-font');
      localStorage.setItem('comicSans', 'true');
    }
  }
}
