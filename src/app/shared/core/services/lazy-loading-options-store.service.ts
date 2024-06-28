import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable, tap } from 'rxjs';

import { FilterParam } from '@shared/auth/models';

import { PaginatedDataResponse, PaginationPayload } from '../models';

@Injectable()
export abstract class LazyLoadingOptionsStoreService<DataType> {
  private readonly _collection$: BehaviorSubject<DataType[]> = new BehaviorSubject<DataType[]>([]);
  private lastLoadedPage = 0;

  get collection$(): Observable<DataType[]> {
    return this._collection$.asObservable();
  }

  get collection(): DataType[] {
    return this._collection$.value;
  }

  loadInstrumentsChunk(filterParams: FilterParam[], paginationPayload: PaginationPayload) {
    if (paginationPayload.page > this.lastLoadedPage) {
      this.lastLoadedPage = paginationPayload.page;

      this.getCollectionChunk$(filterParams, paginationPayload)
        .pipe(
          first(),
          tap(({ data }) => {
            const loadedData = this._collection$.value;

            this._collection$.next([...loadedData, ...data]);
          }),
        )
        .subscribe()
    }
  }

  resetStore() {
    this.lastLoadedPage = 0;
    this._collection$.next([]);
  }

  protected abstract getCollectionChunk$(filterParams: FilterParam[], paginationPayload: PaginationPayload): Observable<PaginatedDataResponse<DataType>>;
}
