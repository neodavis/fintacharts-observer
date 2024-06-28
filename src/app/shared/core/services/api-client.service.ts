import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FilterParam } from '@shared/auth/models';

import { PaginationPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly httpClient = inject(HttpClient);

  get<ResponseType = unknown>(url: string, filterParams: FilterParam[] = [], pagination: PaginationPayload | null = null): Observable<ResponseType> {
    return this.httpClient.get<ResponseType>(url, { params: Object.fromEntries(this.getMappedParams(filterParams, pagination)) });
  }

  post<ResponseType = unknown>(url: string, filterParams: FilterParam[] = [], pagination: PaginationPayload | null = null): Observable<ResponseType> {
    return this.httpClient.post<ResponseType>(url, { ...this.getMappedParams(filterParams, pagination) });
  }

  // TODO: look for better naming
  private getMappedParams(filterParams: FilterParam[] = [], pagination: PaginationPayload | null = null) {
    const params = new Map<string, string>()

    if (filterParams) {
      Object.entries(this.getMappedFilterParams(filterParams)).forEach(([key, value]) => params.set(key, value));
    }

    if (pagination) {
      params.set('page', pagination.page.toString())
      params.set('size', pagination.size.toString())
    }

    return params
  }

  private getMappedFilterParams(filterParams: FilterParam[]) {
    return Object.fromEntries((filterParams ?? []).reduce((acc, filterParam) => acc.set(filterParam.key, filterParam.value as string), new Map<string, string>()));
  }
}
