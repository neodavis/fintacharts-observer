import { Routes } from '@angular/router';
import { JwtGuard } from '@shared/auth/guards';

import { ObserverPageComponent, AuthPageComponent } from './components';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => AuthPageComponent },
  { path: 'observer', loadComponent: () => ObserverPageComponent, canActivate: [JwtGuard] },
  { path: '**', redirectTo: 'observer' },
];
