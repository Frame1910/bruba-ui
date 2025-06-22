import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DeviceService } from '../../services/device.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../api.service';
import { Invite, InviteWithUsers, Metadata } from '../../../types';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-accommodation',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
    CommonModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
})
export class AccommodationComponent {
  @Input() inviteWithUsers: InviteWithUsers | undefined;
  @Input() metadata: Metadata[] | null = null;
  readonly deviceService = inject(DeviceService);
  private _snackbar = inject(MatSnackBar);
  private api = inject(ApiService);
  loading = false;

  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  @Output() submitted = new EventEmitter<void>();

  stayForm = new FormGroup({
    addressControl: new FormControl<string | null>(null, Validators.required),
    needsTransportControl: new FormControl<boolean>(false, Validators.required),
  });
  suggestions: any[] = [];

  ngOnInit() {
    this.stayForm.controls.needsTransportControl.valueChanges.subscribe(
      (value) => {
        if (value === false) {
          this.stayForm.controls.addressControl.setValue(null);
          this.stayForm.controls.addressControl.disable();
        } else {
          this.stayForm.controls.addressControl.enable();
        }
      }
    );
    if (this.inviteWithUsers) {
      let transport: boolean | null = null;
      if (this.inviteWithUsers?.bustransport === 'ACCEPTED') {
        transport = true;
      } else if (this.inviteWithUsers?.bustransport === 'DECLINED') {
        transport = false;
      }
      this.stayForm.setValue({
        addressControl: this.inviteWithUsers?.address || null,
        needsTransportControl: transport,
      });
    }
  }

  async onAddressInput() {
    // Debounce logic
    if ((this as any)._debounceTimeout) {
      clearTimeout((this as any)._debounceTimeout);
    }
    (this as any)._debounceTimeout = setTimeout(async () => {
      const inputValue = this.stayForm.value.addressControl;
      if (!inputValue) {
        this.suggestions = [];
        return;
      }
      const placesLib = (await google.maps.importLibrary('places')) as any;
      const results = await placesLib.Place.searchByText({
        textQuery: inputValue,
        fields: ['displayName', 'formattedAddress', 'location'],
        region: 'au',
      });
      this.suggestions = results.places;
    }, 400);
  }

  async selectSuggestion(suggestion: any) {
    this.stayForm.patchValue({
      addressControl: suggestion,
    });
    this.suggestions = [];
  }

  async onSubmit() {
    if (this.stayForm.invalid) {
      console.error('No address selected');
      return;
    }
    console.log('Submitting address:', this.stayForm.value.addressControl);
  }

  highlightMatch(text: string, query: string): string {
    if (!query) return text;
    // Match words in the text that contain the query letters in order, but not necessarily consecutively
    const pattern = query
      .split('')
      .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*?');
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<b>$1</b>');
  }

  getBusRSVPDate(){
    return this.metadata?.find((m) => m.event === 'busTransportRSVPDue')?.datetime;
  }

  submitAddress() {
    this.loading = true;
    let address;
    let needsTransport: 'ACCEPTED' | 'DECLINED' | 'PENDING' | undefined;
    if (
      this.stayForm.value.addressControl &&
      this.stayForm.value.needsTransportControl
    ) {
      address = this.stayForm.value.addressControl;
    }

    switch (this.stayForm.value.needsTransportControl) {
      case true:
        needsTransport = 'ACCEPTED';
        break;
      case false:
        needsTransport = 'DECLINED';
        break;
      default:
        needsTransport = 'PENDING';
    }
    console.log('Submitting address:', address);
    console.log('Submitting transport needs:', needsTransport);
    const accomData: Invite = {
      bustransport: needsTransport,
      address: address,
    };
    this.api
      .updateInvite(this.inviteWithUsers?.code!, accomData)
      .subscribe(() => {
        this.loading = false;
        this.submitted.emit();
        console.log('request complete');
        this._snackbar.open('Stay info updated successfully!', 'OK', {
          duration: 3000,
        });
      });
  }
}
