import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
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
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../api.service';
import { InviteWithUsers } from '../../types';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
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

  protected readonly isMobile = signal(true);
  readonly themeService = inject(ThemeService);
  private dialog = inject(MatDialog);
  randomSource: number | undefined;
  customImageFlag: boolean = false;
  customImage: string | undefined;
  customImageStyling: string | undefined;
  weddingName: string = 'Wedding of Jakub & Brooke';

  CUSTOM_IMAGES: Record<string, { image: string; style: string }> = {
    '172449': {
      image: 'custom-main/breejake.jpg',
      style: 'object-position: 4%',
    },
    '778468': {
      image: 'custom-main/arvin.jpeg',
      style: 'object-position: 45% 10%',
    },
    '461467': {
      image: 'custom-main/kacpershayla-2.jpg',
      style: 'object-position: 36% 70%',
    },
    '998733': {
      image: 'custom-main/dimmy.jpeg',
      style: 'object-position: 90% 50%',
    },
    '759617': {
      image: 'custom-main/ted.jpg',
      style: 'object-position: 65% 40%',
    },
    '473811': {
      image: 'custom-main/jaydenanabelle.jpg',
      style: 'object-position: 40% 60%',
    },
    '717477': {
      image: 'custom-main/marks.jpg',
      style: 'object-position: 67% 70%',
    },
    '894131': {
      //Parents
      image: 'custom-main/antoniewicz.jpeg',
      style: 'object-position: 50% 75%',
    },
    '505004': {
      //Julia
      image: 'custom-main/antoniewicz-2.jpg',
      style: 'object-position: 50% 50%',
    },
    '575022': {
      image: 'custom-main/dorotalukasz.jpg',
      style: 'object-position: 70% 60%',
    },
  };

  randomImages = [
    { src: '1.jpeg', style: 'object-position: 39% 65%' },
    { src: '2.jpg', style: 'object-position: 39%' },
    { src: '3.jpg', style: 'object-position: 50%' },
    { src: '4.jpg', style: 'object-position: 42%' },
    { src: '5.jpeg', style: 'object-position: 78%' },
    { src: '6.jpeg', style: 'object-position: 40%' },
    { src: '7.jpeg', style: 'object-position: 45%' },
    { src: '8.jpeg', style: 'object-position: 52%' },
    { src: '9.jpg', style: 'object-position: 60% 30%' },
  ];

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

  renderWeddingName() {
    const groomName = localStorage.getItem('groomName') || 'Jakub';
    const nameOrder = localStorage.getItem('nameOrder') || 'BJ';
    if (nameOrder === 'JB') {
      return `Wedding of Brooke & ${groomName}`;
    } else {
      return `Wedding of ${groomName} & Brooke`;
    }
  }

  scrollToContent() {
    const contentElement = this.el.nativeElement.querySelector('#content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
    this.randomSource = Math.floor(Math.random() * 9) + 1; // chooses random imgage
    const inviteCode = localStorage.getItem('inviteCode');
    this.customBakgroundCheck(inviteCode);
  }

  customBakgroundCheck(inviteCode: string | null) {
    const custom = inviteCode ? this.CUSTOM_IMAGES[inviteCode] : undefined;
    if (custom) {
      this.customImage = custom.image;
      this.customImageStyling = custom.style;
    }
  }

  openSettings() {
    this.dialog.open(SettingsDialogComponent, {});
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}

@Component({
  selector: 'settings-dialog',
  template: `
    <h2 mat-dialog-title>Settings</h2>
    <mat-dialog-content>
      <h3>Name Preference</h3>
      <p>
        Who the hell is Jakub? Who the hell is Kuba? Select the preferred name
        that you know the groom by below
      </p>
      <form [formGroup]="namePreferenceForm">
        <mat-chip-listbox formControlName="namePreference">
          <mat-chip-option [value]="'J'" (click)="setNamePreference('Jakub')"
            >Jakub</mat-chip-option
          >
          <mat-chip-option [value]="'K'" (click)="setNamePreference('Kuba')"
            >Kuba</mat-chip-option
          >
        </mat-chip-listbox>
      </form>
      <h3>Name Order</h3>
      <p>Choose how you want the names to be displayed on the wedding page</p>
      <form [formGroup]="nameOrderForm">
        <mat-chip-listbox formControlName="nameOrder">
          <mat-chip-option [value]="'JB'" (click)="setNameOrder('JB')"
            >Brooke & {{ groom }}</mat-chip-option
          >
          <mat-chip-option [value]="'BJ'" (click)="setNameOrder('BJ')"
            >{{ groom }} & Brooke</mat-chip-option
          >
        </mat-chip-listbox>
      </form>
      <!-- <h3>Cancel Invite</h3>
      <p>If you are no longer able to make it, click the button below</p> -->
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
})
export class SettingsDialogComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  inviteAcceptFormGroup: FormGroup | undefined;
  invite: InviteWithUsers | undefined;
  loading = false;
  groom = localStorage.getItem('groomName') || 'Jakub';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  nameOrderForm = new FormGroup({
    nameOrder: new FormControl<string>('BJ'),
  });
  namePreferenceForm = new FormGroup({
    namePreference: new FormControl<string>('J'),
  });

  ngOnInit() {
    let groomName = localStorage.getItem('groomName');
    let nameOrder = localStorage.getItem('nameOrder');
    if (groomName) {
      if (groomName === 'Kuba') {
        this.namePreferenceForm.controls.namePreference.setValue('K');
      } else {
        this.namePreferenceForm.controls.namePreference.setValue('J');
      }
    }
    if (nameOrder) {
      if (nameOrder === 'JB') {
        this.nameOrderForm.controls.nameOrder.setValue('JB');
      } else {
        this.nameOrderForm.controls.nameOrder.setValue('BJ');
      }
    }
  }

  setNamePreference(name: string) {
    this.groom = name;
    localStorage.setItem('groomName', name);
  }

  setNameOrder(name: string) {
    localStorage.setItem('nameOrder', name);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
