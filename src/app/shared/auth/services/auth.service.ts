import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

import { TOKEN_LOCAL_STORAGE_KEY, TokenResponse } from '../models';
import { DATA_PROVIDER_CONFIG } from '../tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly dataProviderConfig = inject(DATA_PROVIDER_CONFIG);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signIn$(email: string, password: string) {
    return this.getUserToken$(email, password)
      .pipe(
        tap(({ access_token }) => localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, access_token))
      )
  }

  signOut() {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);

    this.router.navigate(['/auth']);
  }

  private getUserToken$(email: string, password: string) {
    const body = new HttpParams({
      fromObject: {
        'grant_type': this.dataProviderConfig.grant_type,
        'client_id': this.dataProviderConfig.client_id,
        'username': email,
        'password': password,
      }
    });

    return this.httpClient.post<TokenResponse>(`/identity/realms/${this.dataProviderConfig.realm}/protocol/openid-connect/token`, body)
  }
}
