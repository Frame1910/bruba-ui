import { Route } from '@angular/router';
import { InviteSigninComponentComponent } from './invite-signin/invite-signin.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: InviteSigninComponentComponent,
  },
  {
    path: 'invite/:code',
    component: InviteSigninComponentComponent,
  },
];
