import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sad-screen',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './sad-screen.component.html',
  styleUrl: './sad-screen.component.scss',
})
export class SadScreenComponent {
  readonly router = inject(Router);

  renderName() {
    const groomName = localStorage.getItem('groomName') || 'Jakub';
    const nameOrder = localStorage.getItem('nameOrder') || 'BJ';
    if (nameOrder === 'JB') {
      return `Brooke & ${groomName}`;
    } else {
      return `${groomName} & Brooke`;
    }
  }
}
