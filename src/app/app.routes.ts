import { Route } from '@angular/router';
import { InviteSigninComponentComponent } from './invite-signin/invite-signin.component';
import { InviteManagementComponentComponent } from './invite-management/invite-management.component';

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
];
