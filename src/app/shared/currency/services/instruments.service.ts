import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Instrument, InstrumentWithMappedProvider } from '@shared/currency/models';
import { PaginatedDataResponse, PaginationPayload } from '@shared/core/models';
import { FilterParam } from '@shared/auth/models';
import { ApiClient } from '@shared/core/services';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {
  private apiClient = inject(ApiClient);

  getInstruments$(filterParams: FilterParam[], pagination: PaginationPayload | null = null) {
    return this.apiClient.get<PaginatedDataResponse<Instrument>>(`/api/instruments/v1/instruments`, filterParams, pagination)
      .pipe(
        map((paginatedDataResponse) => ({
          ...paginatedDataResponse,
          data: this.mapProviderData(filterParams, paginatedDataResponse.data)
        })),
      )
  }

  private mapProviderData(filterParams: FilterParam[], instruments: Instrument[]) {
    return instruments
      .reduce((acc: InstrumentWithMappedProvider[], item) => {
        Object.entries(item.mappings).forEach(([provider, mapping]) => {
          acc.push({ ...item, provider, symbol: mapping.symbol })
        })

        return acc;
      }, [])
      .filter((instrument) => {
        const providerFilter = filterParams.find(filter => filter.key === 'provider' && (filter.value as string[]).length)
        return providerFilter ? (providerFilter.value as string[]).includes(instrument.provider) : instrument;
      })
  }
}
