import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { DeviceService } from '../../services/device.service';
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
    MatChipsModule
  ],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss',
})
export class AccommodationComponent {
  readonly deviceService = inject(DeviceService);
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  address: any | null | undefined;
  addressText: string = '';
  suggestions: any[] = [];

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
      region: 'au'
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
}
