import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from "@angular/material/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishing-well',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './wishing-well.component.html',
  styleUrl: './wishing-well.component.scss'
})
export class WishingWellComponent {
  private _snackbar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

  renderName() {
    const groomName = localStorage.getItem('groomName') || 'Jakub';
    const nameOrder = localStorage.getItem('nameOrder') || 'BJ';
    if (nameOrder === 'BJ') {
      return `Brooke & ${groomName}`;
    } else {
      return `${groomName} & Brooke`;
    }
  }

  copySnackbar(content: string, item: string) {
    this._snackbar.open(`${item} copied to clipboard!`, undefined, {
      duration: 2000,
    });
    this.clipboard.copy(content);
  }

}
