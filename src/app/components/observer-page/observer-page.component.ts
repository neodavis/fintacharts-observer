import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { Button } from 'primeng/button';

import { AuthService } from '@shared/auth/services';
import { DropdownOption } from '@shared/core/models';
import { historyFrequencyOptions, HistoryFrequencyPayload } from '@shared/currency/models';
import { InstrumentWithMappedProvider } from '@shared/currency/models';

import { InstrumentHistoryComponent, InstrumentSelectFormComponent } from './components';
import { ObserverPageStoreService } from './services';

@Component({
  selector: 'app-observer-page',
  standalone: true,
  imports: [
    CommonModule,
    InstrumentSelectFormComponent,
    ReactiveFormsModule,
    DropdownModule,
    InstrumentHistoryComponent,
    Button,
  ],
  templateUrl: './observer-page.component.html',
  styleUrl: './observer-page.component.scss',
  providers: [ObserverPageStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObserverPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly observerPageStoreService = inject(ObserverPageStoreService);
  private readonly destroyRef = inject(DestroyRef)
  private readonly authService = inject(AuthService);

  readonly instrumentsForm = this.formBuilder.group({
    historyFrequency: this.formBuilder.control<DropdownOption<HistoryFrequencyPayload>>(historyFrequencyOptions[0]),
    instrument: this.formBuilder.control<InstrumentWithMappedProvider | null>(null),
  });

  ngOnInit() {
    this.instrumentsForm.valueChanges
      .pipe(
        filter(() => !!this.instrumentsForm.value.instrument),
        tap(() => {
          const { instrument, historyFrequency } = this.instrumentsForm.value;
          const { periodicity, interval } = historyFrequency!.value;

          this.observerPageStoreService.loadCountBackHistory(instrument!.id, instrument!.provider, interval, periodicity);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }

  protected readonly historyFrequencyOptions = historyFrequencyOptions;

  signOut() {
    this.authService.signOut();
  }
}
