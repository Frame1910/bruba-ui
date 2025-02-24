import { Route } from '@angular/router';
import { InviteSigninComponentComponent } from './invite-signin/invite-signin.component';
import { InviteManagementComponentComponent } from './invite-management/invite-management.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: HomeComponent,
    children: [
      {
        path: 'invite/:code',
        component: InviteManagementComponentComponent,
      },
    ],
  },
  {
    path: 'sign-in',
    component: InviteSigninComponentComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
