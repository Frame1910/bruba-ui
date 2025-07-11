import { Route } from '@angular/router';
import { InviteSigninComponentComponent } from './invite-signin/invite-signin.component';
import { InviteManagementComponentComponent } from './invite-management/invite-management.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { inviteCodeGuard } from './invite-code.guard';
import { SadScreenComponent } from './sad-screen/sad-screen.component';
import { FrogScreenComponent } from './frog-screen/frog-screen.component';
import { RiceCookerComponent } from './rice-cooker/rice-cooker.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [inviteCodeGuard],
    children: [
      {
        path: 'invite/:code',
        component: InviteManagementComponentComponent,
      },
      {
        path: '',
        component: MainScreenComponent,
      },
    ],
  },
  {
    path: 'onboarding/:code',
    component: OnboardingComponent,
  },
  {
    path: 'sign-in',
    component: InviteSigninComponentComponent,
  },
  {
    path: 'declined',
    component: SadScreenComponent,
  },
  {
    path: 'frog',
    component: FrogScreenComponent,
  },
  {
    path: 'rice-cooker',
    component: RiceCookerComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
