import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
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
import { Invite, InviteWithUsers } from '../../../types';
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
  ],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
})
export class AccommodationComponent {
  @Input() inviteWithUsers: InviteWithUsers | undefined;
  readonly deviceService = inject(DeviceService);
  private _snackbar = inject(MatSnackBar);
  private _formBuilder = inject(FormBuilder);
  private api = inject(ApiService);

  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  address: any | null | undefined;
  addressText: string = '';
  suggestions: any[] = [];
  stayForm: FormGroup | undefined;

  ngOnInit() {
    if (this.inviteWithUsers) {
      console.log(this.inviteWithUsers);
      console.log(this.inviteWithUsers.address)
      const group: { [key: string]: any } = {};
      let chipStatus = 'PENDING';
      if (this.inviteWithUsers?.bustransport === 'ACCEPTED') {
        chipStatus = 'true';
      } else if (this.inviteWithUsers?.bustransport === 'DECLINED') {
        chipStatus = 'false';
      }
      group['needsTransport'] = [chipStatus, Validators.required];
      group['address'] = [this.inviteWithUsers?.address, Validators.required];
      this.stayForm = this._formBuilder.group(group);
      console.log(this.stayForm)
      this.addressText = this.inviteWithUsers!.address ?? ''
    }
  }

  async onAddressInput() {
    // Debounce logic
    if ((this as any)._debounceTimeout) {
      clearTimeout((this as any)._debounceTimeout);
    }
    (this as any)._debounceTimeout = setTimeout(async () => {
      const inputValue = this.addressText;
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
    }, 1000);
  }

  async selectSuggestion(suggestion: any) {
    this.address = suggestion;
    this.addressText = suggestion.formattedAddress;
    this.suggestions = [];
  }

  async onSubmit() {
    if (!this.address) {
      console.error('No address selected');
      return;
    }
    console.log('Submitting address:', this.address);
    console.log('Selected address:', this.address.formattedAddress);
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

  submitAddress() {
    const formValues = this.stayForm?.value;
    const mockData: Invite = {
      bustransport: formValues.needsTransport === 'true' ? 'ACCEPTED' : formValues.needsTransport === 'false' ? 'DECLINED' : 'PENDING',
      address: formValues.address,
    };
    this.api
      .updateInvite(this.inviteWithUsers?.code!, mockData)
      .subscribe(() => {
        console.log('request complete');
        this._snackbar.open('Stay info updated successfully!', 'OK', {
          duration: 3000,
        });
      });
  }
}
