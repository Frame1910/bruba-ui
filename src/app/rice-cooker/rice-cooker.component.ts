import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rice-cooker',
  imports: [MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './rice-cooker.component.html',
  styleUrl: './rice-cooker.component.scss',
})
export class RiceCookerComponent {}
