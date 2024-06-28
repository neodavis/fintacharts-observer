import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { MarketData } from '@shared/currency/models';

import { ObserverPageStoreService } from '../../services';

@Component({
  selector: 'app-instrument-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instrument-history.component.html',
  styleUrl: './instrument-history.component.scss'
})
export class InstrumentHistoryComponent implements AfterViewInit {
  @ViewChild('instrumentHistoryChart') instrumentHistoryChart!: ElementRef<HTMLCanvasElement>;

  @Input() symbol: string = '';

  private chart!: Chart;
  private readonly observerPageStoreService = inject(ObserverPageStoreService);
  private readonly destroyRef = inject(DestroyRef);

  lastUpdatedMarketData$: BehaviorSubject<MarketData | null> = new BehaviorSubject<MarketData | null>(null);

  ngAfterViewInit() {
    this.initializeChart();
    this.listenInstrumentHistorySnapshots();
    this.listenInstrumentLiveSnapshots();
  }

  private initializeChart() {
    this.chart = new Chart(this.instrumentHistoryChart.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            pointRadius: 0,
            label: 'Close Price',
            data: [],
            borderWidth: 1
          },
        ]
      },
      options: {
        animation: {
          duration: 0,
          easing: 'linear',
          loop: false,
          delay: 100,
        },
        showLine: true,
        scales: {
          x: {
            display: false
          },
          myScale: {
            type: 'linear',
            position: 'right',
          },
        }
      }
    });
  }

  private listenInstrumentHistorySnapshots() {
    this.observerPageStoreService.instrumentHistorySnapshots$
      .pipe(
        filter((instrumentHistorySnapshots) => !!this.chart && !!instrumentHistorySnapshots.length),
        tap((instrumentHistorySnapshots) => {
          const data = instrumentHistorySnapshots.map(instrumentHistorySnapshot => instrumentHistorySnapshot.c);
          const labels = instrumentHistorySnapshots.map(instrumentHistorySnapshot => new Date(instrumentHistorySnapshot.t).toLocaleTimeString());
          const lastIndex = instrumentHistorySnapshots.length - 1;

          this.chart.data.datasets[0].data = data;
          this.chart.data.labels = labels;

          this.lastUpdatedMarketData$.next({
            price: data[lastIndex],
            symbol: this.symbol,
            time: this.getFormattedDate(new Date(instrumentHistorySnapshots[lastIndex].t))
          })

          this.chart.update();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe()
  }

  private listenInstrumentLiveSnapshots() {
    this.observerPageStoreService.instrumentLiveSnapshot$
      .pipe(
        filter((instrumentLiveSnapshot) => !!this.chart && !!instrumentLiveSnapshot.last),
        tap((instrumentLiveSnapshot) => {
          const data = instrumentLiveSnapshot.last.price;
          const label = new Date(instrumentLiveSnapshot.last.timestamp).toLocaleTimeString();

          this.chart.data.datasets[0].data.push(data);
          this.chart.data.labels?.push(label);

          this.lastUpdatedMarketData$.next({
            price: data,
            symbol: this.symbol,
            time: this.getFormattedDate(new Date(instrumentLiveSnapshot.last.timestamp))
          });

          this.chart.update();
        })
      )
      .subscribe()
  }

  private getFormattedDate(date: Date) {
    const optionsDate = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', optionsDate as Intl.DateTimeFormatOptions);

    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime as Intl.DateTimeFormatOptions);

    return `${formattedDate}, ${formattedTime}`;
  }
}
