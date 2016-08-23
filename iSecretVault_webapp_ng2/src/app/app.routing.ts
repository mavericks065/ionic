import { Routes, RouterModule }   from '@angular/router';

import { authenticationSignupRoutes } from './authentication/authentication-signup/authentication-signup.routing';

const appRoutes: Routes = [
  ...authenticationSignupRoutes
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(appRoutes);