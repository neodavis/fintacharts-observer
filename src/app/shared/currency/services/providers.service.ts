import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataResponse } from '@shared/core/models';

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private httpClient = inject(HttpClient);

  getProviders$() {
    return this.httpClient.get<DataResponse<string>>(`/api/instruments/v1/providers`)
  }
}
