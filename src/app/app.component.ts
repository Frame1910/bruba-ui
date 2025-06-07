import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Theme } from '../types';

@Component({
  imports: [CommonModule, RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ui';
  readonly themeService = inject(ThemeService);

  constructor(private matIconReg: MatIconRegistry) {}

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');

    if (!localStorage.getItem('theme')){
      this.themeService.setTheme('light')
    } else {
      const theme = localStorage.getItem('theme') as Theme
      this.themeService.setTheme(theme)
    }

  }
}
