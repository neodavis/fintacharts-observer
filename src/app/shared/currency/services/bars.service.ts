import { inject, Injectable } from '@angular/core';
import { DataResponse } from '@shared/core/models';
import { ApiClient } from '@shared/core/services';
import { FilterParam } from '@shared/auth/models';

import { Periodicity, InstrumentHistorySnapshot } from '../models';

@Injectable({ providedIn: 'root' })
export class BarsService {
  private httpClient = inject(ApiClient);

  getCountBackHistory$(instrumentId: string, provider: string, interval: number, periodicity: Periodicity, barsCount = 100) {
    const filterParams: FilterParam[] = [
      { key: 'instrumentId', value: instrumentId },
      { key: 'provider', value: provider },
      { key: 'interval', value: interval },
      { key: 'periodicity', value: periodicity },
      { key: 'barsCount', value: barsCount },
    ]

    return this.httpClient.get<DataResponse<InstrumentHistorySnapshot[]>>(`/api/bars/v1/bars/count-back`, filterParams);
  }

  getDateRangeHistory$(instrumentId: string, provider: string, interval: number, periodicity: Periodicity, startDate: string, endDate: string) {
    const filterParams: FilterParam[] = [
      { key: 'instrumentId', value: instrumentId },
      { key: 'provider', value: provider },
      { key: 'interval', value: interval },
      { key: 'periodicity', value: periodicity },
      { key: 'startDate', value: startDate },
      { key: 'endDate', value: endDate },
    ]
    return this.httpClient.get<DataResponse<InstrumentHistorySnapshot[]>>(`/api/bars/v1/bars/date-range`, filterParams);
  }
}
