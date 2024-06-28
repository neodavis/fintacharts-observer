import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';

import { TOKEN_LOCAL_STORAGE_KEY } from '../models';
import { AuthService } from '../services';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
  const authService = inject(AuthService);

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.signOut();
      }

      return throwError(error);
    })
  );
}
