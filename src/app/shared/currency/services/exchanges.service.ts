import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataResponse } from '@shared/core/models';

@Injectable({ providedIn: 'root' })
export class ExchangesService {
  private httpClient = inject(HttpClient);

  getExchanges$() {
    return this.httpClient.get<DataResponse<string>>(`/api/instruments/v1/exchanges`)
  }
}
