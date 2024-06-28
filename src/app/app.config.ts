import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { DATA_PROVIDER_CONFIG } from '@shared/auth/tokens';
import { jwtInterceptor } from '@shared/auth/interceptors';

import { environment } from './environment/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor]), withInterceptorsFromDi()),
    { provide: DATA_PROVIDER_CONFIG, useValue: environment }
  ]
};
