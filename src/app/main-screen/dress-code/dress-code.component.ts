import { Component, inject } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dress-code',
  imports: [],
  templateUrl: './dress-code.component.html',
  styleUrl: './dress-code.component.scss'
})
export class DressCodeComponent {
  readonly deviceService = inject(DeviceService);
  readonly themeService = inject(ThemeService);

}
