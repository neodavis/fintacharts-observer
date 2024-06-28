import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { PaginatedDataResponse, PaginationPayload } from '@shared/core/models';
import { InstrumentWithMappedProvider } from '@shared/currency/models';
import { LazyLoadingOptionsStoreService } from '@shared/core/services';
import { FilterParam } from '@shared/auth/models';

import { InstrumentsService } from './instruments.service';

@Injectable({ providedIn: 'root' })
export class InstrumentsLazyLoadingOptionsService extends LazyLoadingOptionsStoreService<InstrumentWithMappedProvider> {
  private instrumentsService = inject(InstrumentsService);

  getCollectionChunk$(filterParams: FilterParam[], paginationPayload: PaginationPayload): Observable<PaginatedDataResponse<InstrumentWithMappedProvider>> {
    return this.instrumentsService.getInstruments$(filterParams, paginationPayload);
  }
}
