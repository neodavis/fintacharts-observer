import { Routes } from '@angular/router';

import { ObserverPageComponent, AuthPageComponent } from './components';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => AuthPageComponent },
  { path: 'observer', loadComponent: () => ObserverPageComponent },
  { path: '**', redirectTo: 'observer' },
];
