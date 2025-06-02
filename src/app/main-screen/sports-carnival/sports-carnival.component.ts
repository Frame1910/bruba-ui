import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sports-carnival',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule
  ],
  templateUrl: './sports-carnival.component.html',
  styleUrl: './sports-carnival.component.scss'
})
export class SportsCarnivalComponent {
  sportsCarnivalGoogleCalendarURL: string = environment.sportsCarnivalGoogleCalendarURL;
  sportsCarnivalOutlookCalendarURL: string = environment.sportsCarnivalOutlookCalendarURL;

}
