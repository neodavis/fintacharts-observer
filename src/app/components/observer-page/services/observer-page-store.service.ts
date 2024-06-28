import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, first, Observable, tap } from 'rxjs';
import { InstrumentHistorySnapshot } from '../../../shared/currency/models/instruments.model';
import { BarsService } from '../../../shared/currency/services/bars.service';
import { Periodicity } from '../../../shared/currency/models/history.model';
import { WebsocketObserverService } from '../../../shared/core/services';
import { TOKEN_LOCAL_STORAGE_KEY } from '../../../shared/auth/models';
import { LiveLastPriceUpdateMessage } from '../../../shared/currency/models/live-update.model';

@Injectable()
export class ObserverPageStoreService {
  private readonly _instrumentHistorySnapshots$: BehaviorSubject<InstrumentHistorySnapshot[]> = new BehaviorSubject<InstrumentHistorySnapshot[]>([]);
  private readonly barsService = inject(BarsService);
  private readonly websocketObserverService = inject(WebsocketObserverService);

  private currentInstrumentSubscription : Record<string, unknown> | null = null;

  get instrumentLiveSnapshot$() {
    return this.websocketObserverService.messages$ as Observable<LiveLastPriceUpdateMessage>;
  }

  get instrumentHistorySnapshots$() {
    return this._instrumentHistorySnapshots$.asObservable();
  }

  constructor() {
    const url = new URLSearchParams({ token: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)! })
    this.websocketObserverService.connect(`?${url.toString()}`);
  }

  loadCountBackHistory(instrumentId: string, provider: string, interval: number, periodicity: Periodicity) {
    this.subscribeToRealtimeData(instrumentId, provider);

    this.barsService.getCountBackHistory$(instrumentId, provider, interval, periodicity)
      .pipe(
        first(),
        tap(({ data }) => {
          this._instrumentHistorySnapshots$.next(data);
        }),
      )
      .subscribe()
  }

  private subscribeToRealtimeData(instrumentId: string, provider: string) {
    const nextInstrumentSubscription = {
      type: 'l1-subscription',
      id: '1',
      instrumentId,
      provider,
      subscribe: true,
      kinds: ['last'],
    }

    if (this.currentInstrumentSubscription) {
      this.websocketObserverService.sendMessage(JSON.stringify({
        ...this.currentInstrumentSubscription,
        subscribe: false,
      }))
    }

    this.websocketObserverService.sendMessage(JSON.stringify(nextInstrumentSubscription))
    this.currentInstrumentSubscription = nextInstrumentSubscription;
  }
}
