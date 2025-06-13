import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sad-screen',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sad-screen.component.html',
  styleUrl: './sad-screen.component.scss'
})
export class SadScreenComponent {
  readonly router = inject(Router);

}
