import { Route } from '@angular/router';
import { InviteSigninComponentComponent } from './invite-signin/invite-signin.component';
import { InviteManagementComponentComponent } from './invite-management/invite-management.component';
import { MainScreenComponent } from './main-screen/main-screen.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'invite',
    pathMatch: 'full',
  },
  {
    path: 'invite',
    component: InviteSigninComponentComponent,
  },
  {
    path: 'invite/:code',
    component: InviteManagementComponentComponent,
  },
  {
    path: 'main',
    component: MainScreenComponent,
  }
];
