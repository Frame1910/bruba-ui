import { lastValueFrom } from 'rxjs';
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
import { Title } from '@angular/platform-browser';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../api.service';
import { Invite, InviteWithUsers } from '../../types';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import packageJson from '../../../package.json';
import { HttpClient } from '@angular/common/http';
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
    if (event.key === 'S') {
      this.themeService.comicSansToggle();
    }
  }

  protected readonly isMobile = signal(true);
  readonly themeService = inject(ThemeService);
  private dialog = inject(MatDialog);
  private titleService = inject(Title);
  randomSource: number | undefined;
  customImageFlag: boolean = false;
  customImage: string | undefined;
  customImageStyling: string | undefined;
  weddingName: string = 'Wedding of Jakub & Brooke';
  minecraftMode = localStorage.getItem('minecraftMode') || false;
  inviteCode = localStorage.getItem('inviteCode') || '';

  // Image cycling properties
  allAvailableImages: Array<{ src: string; style: string; isCustom: boolean }> =
    [];
  currentImageIndex: number = 0;
  isManualMode: boolean = false;
  isTransitioning: boolean = false;

  CUSTOM_IMAGES: Record<string, Array<{ image: string; style: string }>> = {
    '172449': [
      {
        image: 'custom-main/breejake.jpg',
        style: 'object-position: 4%',
      },
      {
        image: 'custom-main/bree-board.jpg',
        style: 'object-position: 50%',
      },
    ],
    '778468': [
      {
        image: 'custom-main/arvin.jpeg',
        style: 'object-position: 45% 10%',
      },
    ],
    '461467': [
      {
        image: 'custom-main/kacpershayla-2.jpg',
        style: 'object-position: 36% 70%',
      },
    ],
    '998733': [
      {
        image: 'custom-main/dimmy.jpeg',
        style: 'object-position: 90% 50%',
      },
    ],
    '759617': [
      {
        image: 'custom-main/ted.jpg',
        style: 'object-position: 65% 40%',
      },
    ],
    '473811': [
      {
        image: 'custom-main/jaydenanabelle.jpg',
        style: 'object-position: 40% 60%',
      },
    ],
    '717477': [
      {
        image: 'custom-main/marks.jpg',
        style: 'object-position: 67% 70%',
      },
      {
        image: 'custom-main/marks-board.jpg',
        style: 'object-position: 50%',
      },
    ],
    //Parents
    '894131': [
      {
        image: 'custom-main/antoniewicz.jpeg',
        style: 'object-position: 50% 75%',
      },
      {
        image: 'custom-main/anton-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
    //Julia
    '505004': [
      {
        image: 'custom-main/antoniewicz-2.jpg',
        style: 'object-position: 50% 50%',
      },
      {
        image: 'custom-main/anton-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
    '575022': [
      {
        image: 'custom-main/dorotalukasz.jpg',
        style: 'object-position: 70% 60%',
      },
      {
        image: 'custom-main/dorislukasz-board.jpg',
        style: 'object-position: 30% 70%',
      },
    ],
    '245554': [
      {
        image: 'custom-main/jamestanieka-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
    '134556': [
      {
        image: 'custom-main/darrenkara-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
    '583715': [
      {
        image: 'custom-main/ashpatryk-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
    '554135': [
      {
        image: 'custom-main/ashpatryk-board.jpg',
        style: 'object-position: 50% 50%',
      },
    ],
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
    { src: 'board.jpg', style: 'object-position: 60% 30%' },
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
    if (nameOrder === 'BJ') {
      return `Wedding of Brooke & ${groomName}`;
    } else {
      return `Wedding of ${groomName} & Brooke`;
    }
  }

  updateTitle() {
    const dynamicTitle = this.renderWeddingName();
    this.titleService.setTitle(dynamicTitle);
  }

  setupAvailableImages(inviteCode: string | null) {
    // Start with random images
    this.allAvailableImages = this.randomImages.map((img) => ({
      src: img.src,
      style: img.style,
      isCustom: false,
    }));

    // Add custom images if available
    const customImages = inviteCode
      ? this.CUSTOM_IMAGES[inviteCode]
      : undefined;
    if (customImages) {
      const customImageObjects = customImages.map((img) => ({
        src: img.image,
        style: img.style,
        isCustom: true,
      }));
      this.allAvailableImages = [
        ...this.allAvailableImages,
        ...customImageObjects,
      ];
    }

    // Set initial index - will be updated after customBakgroundCheck runs
    if (this.randomSource) {
      this.currentImageIndex = this.randomSource - 1;
    }
  }

  cycleImage() {
    if (this.isTransitioning) return; // Prevent multiple clicks during transition

    this.isManualMode = true;
    this.isTransitioning = true;

    // Fade out current image
    const currentImageElement = document.querySelector(
      '.background-image'
    ) as HTMLElement;
    if (currentImageElement) {
      currentImageElement.style.opacity = '0';
    }

    // Wait for fade out, then change image and fade in
    setTimeout(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.allAvailableImages.length;

      const currentImage = this.allAvailableImages[this.currentImageIndex];

      if (currentImage.isCustom) {
        this.customImageFlag = true;
        this.customImage = currentImage.src;
        this.customImageStyling = currentImage.style;
        this.randomSource = undefined;
      } else {
        this.customImageFlag = false;
        this.customImage = undefined;
        this.customImageStyling = undefined;
        this.randomSource = this.currentImageIndex + 1;
      }

      // Wait for Angular to update the DOM, then fade in new image
      setTimeout(() => {
        const newImageElement = document.querySelector(
          '.background-image'
        ) as HTMLElement;
        if (newImageElement) {
          newImageElement.style.opacity = '1';
        }
        this.isTransitioning = false;
      }, 50);
    }, 300); // 300ms fade out duration
  }

  getCurrentImageInfo() {
    if (this.allAvailableImages.length > 0) {
      const current = this.allAvailableImages[this.currentImageIndex];
      return `${this.currentImageIndex + 1} / ${
        this.allAvailableImages.length
      }`;
    }
    return '';
  }

  scrollToContent() {
    const contentElement = this.el.nativeElement.querySelector('#content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
    this.randomSource = Math.floor(Math.random() * 10) + 1; // chooses random imgage
    const inviteCode = localStorage.getItem('inviteCode');
    this.setupAvailableImages(inviteCode);
    this.customBakgroundCheck(inviteCode);
    this.updateTitle();
  }

  customBakgroundCheck(inviteCode: string | null) {
    const custom = inviteCode ? this.CUSTOM_IMAGES[inviteCode] : undefined;
    if (custom) {
      const randomIndex = Math.floor(Math.random() * custom.length);
      this.customImageFlag = true;
      this.customImage = custom[randomIndex].image;
      this.customImageStyling = custom[randomIndex].style;

      // Update current image index for cycling
      this.currentImageIndex = this.allAvailableImages.findIndex(
        (img) => img.src === this.customImage
      );
      if (this.currentImageIndex === -1) {
        this.currentImageIndex = 0;
      }
    }
  }

  openSettings() {
    this.dialog.open(SettingsDialogComponent, {});
  }

  minecraftModeCheck() {
    const minecraftMode = localStorage.getItem('minecraftMode');
    if (minecraftMode === 'true') {
      return true;
    } else {
      return false;
    }
  }

  @HostListener('click', ['$event'])
  playClickNoise(event: MouseEvent) {
    if (localStorage.getItem('minecraftMode') === 'true') {
      const audio = new Audio('minecraft-mode/minecraft_click.mp3');
      audio.play();
    }
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}

@Component({
  selector: 'settings-dialog',
  template: `
    <h2 (click)="onTitleTap()" mat-dialog-title>Settings</h2>
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
            >{{ groom }} & Brooke</mat-chip-option
          >
          <mat-chip-option [value]="'BJ'" (click)="setNameOrder('BJ')"
            >Brooke & {{ groom }}</mat-chip-option
          >
        </mat-chip-listbox>
      </form>
      <!-- <h3>Cancel Invite</h3>
      <p>If you are no longer able to make it, click the button below</p> -->
      @if(devMode) {
      <h3>Developer Mode</h3>
      <span style="display: flex; flex-direction: row; gap: 0.5rem;">
        <mat-chip (click)="resetInvite()">Reset Invite</mat-chip>
        <mat-chip-option [selected]="minecraftMode" (click)="setMinecraftMode()"
          >Minecraft Mode</mat-chip-option
        >
      </span>
      }
      <span
        style="
          position: absolute;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          color: var(--mat-sys-on-surface);
        "
      >
        V{{ version }}
      </span>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
    @if (loading) {
    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }
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
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private titleService = inject(Title);
  public version: string = packageJson.version;
  private api = inject(ApiService);
  inviteAcceptFormGroup: FormGroup | undefined;
  invite: InviteWithUsers | undefined;
  loading = false;
  groom = localStorage.getItem('groomName') || 'Jakub';
  minecraftMode = localStorage.getItem('minecraftMode') === 'true';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  devMode = localStorage.getItem('devMode') || false;

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
    this.http
      .get<{ version: string }>('/assets/package.json')
      .subscribe((pkg) => {
        this.version = pkg.version;
      });
  }
  @HostListener('document:keydown', ['$event'])
  handleDevKey(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'd' && event.ctrlKey && event.altKey) {
      this.devMode = !this.devMode;
      localStorage.setItem('devMode', this.devMode ? 'true' : 'false');
    }
  }

  private tapCount = 0;
  private tapTimeout: any;

  onTitleTap() {
    this.tapCount++;
    if (this.tapCount === 3) {
      this.devMode = !this.devMode;
      localStorage.setItem('devMode', this.devMode ? 'true' : 'false');
      this.tapCount = 0;
    }
    clearTimeout(this.tapTimeout);
    this.tapTimeout = setTimeout(() => {
      this.tapCount = 0;
    }, 1000);
  }

  @HostListener('click', ['$event'])
  playClickNoise(event: MouseEvent) {
    if (localStorage.getItem('minecraftMode') === 'true') {
      const audio = new Audio('minecraft-mode/minecraft_click.mp3');
      audio.play();
    }
  }

  setNamePreference(name: string) {
    this.groom = name;
    localStorage.setItem('groomName', name);
    this.updatePageTitle();
  }

  setNameOrder(name: string) {
    localStorage.setItem('nameOrder', name);
    this.updatePageTitle();
  }

  private updatePageTitle() {
    const groomName = localStorage.getItem('groomName') || 'Jakub';
    const nameOrder = localStorage.getItem('nameOrder') || 'BJ';
    let dynamicTitle;
    if (nameOrder === 'BJ') {
      dynamicTitle = `Wedding of Brooke & ${groomName}`;
    } else {
      dynamicTitle = `Wedding of ${groomName} & Brooke`;
    }
    this.titleService.setTitle(dynamicTitle);
  }

  setMinecraftMode() {
    this.minecraftMode = !this.minecraftMode;
    localStorage.setItem(
      'minecraftMode',
      this.minecraftMode ? 'true' : 'false'
    );
  }

  async resetInvite() {
    this.loading = true;
    // console.log('Resetting invite');
    const userStatus: Array<{ userId: string; status: string }> = [];
    const userSCStatus: Array<{ userId: string; scstatus: string }> = [];
    const code = localStorage.getItem('inviteCode');
    if (!code) return;

    const invite = await lastValueFrom(this.api.getInvitees(code));
    this.invite = invite;
    // console.log('Invite data:', this.invite);

    if (this.invite) {
      for (const user of this.invite.UserInvite) {
        // console.log(user);
        if (user.isPlusOne) {
          await lastValueFrom(
            this.api.deleteUserInvite(user.userId, user.inviteCode)
          );
          // console.log(`Deleted ${user.user.firstName} from invite: ${user.inviteCode}`);
          await lastValueFrom(this.api.deleteUser(user.userId));
          // console.log(`Deleted user: ${user.user.firstName}`);
        } else {
          const userData = {
            id: user.userId,
            email: '',
            dietary: '',
            allergies: '',
          };
          await lastValueFrom(this.api.updateUser(user.userId, userData));
          // console.log(`Reset user data for ${user.user.firstName} in invite: ${user.inviteCode}`);
          userStatus.push({
            userId: user.userId,
            status: 'PENDING',
          });
          userSCStatus.push({
            userId: user.userId,
            scstatus: 'PENDING',
          });
          // console.log(userStatus);
          // console.log(userSCStatus);
        }
      }
      await lastValueFrom(this.api.updateInviteStatuses(userStatus, code));
      // console.log('Reset invite statuses');
      await lastValueFrom(
        this.api.updateSportsCarnivalStatuses(userSCStatus, code)
      );
      // console.log('Reset sports carnival statuses');
      const accomData: Invite = {
        bustransport: 'PENDING',
        address: '',
      };
      await lastValueFrom(this.api.updateInvite(code, accomData));
      localStorage.removeItem('inviteCode');
      window.location.reload();
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
