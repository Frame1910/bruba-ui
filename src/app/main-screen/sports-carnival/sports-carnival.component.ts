import { InviteWithUsers } from './../../../types';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sports-carnival',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './sports-carnival.component.html',
  styleUrl: './sports-carnival.component.scss'
})
export class SportsCarnivalComponent {
  @Input() inviteWithUsers: InviteWithUsers | undefined;
  sportsCarnivalGoogleCalendarURL: string = environment.sportsCarnivalGoogleCalendarURL;
  sportsCarnivalOutlookCalendarURL: string = environment.sportsCarnivalOutlookCalendarURL;
}
