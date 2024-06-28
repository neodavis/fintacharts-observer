import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { DropdownLazyLoadEvent, DropdownModule } from 'primeng/dropdown';
import { PrimeTemplate } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, tap } from 'rxjs';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InstrumentsLazyLoadingOptionsService, ProvidersService } from '@shared/currency/services';
import { InstrumentWithMappedProvider } from '@shared/currency/models';
import { FilterParam } from '@shared/auth/models';
import { PaginationPayload } from '@shared/core/models';


@Component({
  selector: 'app-instrument-select-form',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    PrimeTemplate,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipModule,
    InputTextModule,
    ToggleButtonModule,
  ],
  templateUrl: './instrument-select-form.component.html',
  styleUrl: './instrument-select-form.component.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InstrumentSelectFormComponent), multi: true },
    InstrumentsLazyLoadingOptionsService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentSelectFormComponent implements OnInit, ControlValueAccessor {
  private readonly formBuilder = inject(FormBuilder);
  private readonly instrumentsLazyLoadingOptionsService = inject(InstrumentsLazyLoadingOptionsService);
  private readonly providersService = inject(ProvidersService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 100;
  readonly instruments$ = this.instrumentsLazyLoadingOptionsService.collection$;
  readonly instrumentControl = this.formBuilder.control<InstrumentWithMappedProvider | null>(null);
  readonly symbolControl = this.formBuilder.control<string>('');
  readonly providersControl = this.formBuilder.control<string[]>([]);
  readonly providers$ = this.providersService.getProviders$()
    .pipe(
      map(({ data }) => data)
    );

  onChange!: (instrument: InstrumentWithMappedProvider | null) => void;
  onTouched!: () => void;

  ngOnInit() {
    this.listenInstrumentChanges();
    this.listenSymbolChanges();
  }

  loadInstrumentsChunk({ first, last }: DropdownLazyLoadEvent) {
    const currentPage = Math.round((first ?? 0) / this.pageSize) + 1;

    if (this.instrumentsLazyLoadingOptionsService.collection.length === last) {
      this.loadNewChunk({ page: currentPage, size: this.pageSize });
    }
  }

  toggleProviderFilter(toggledProvider: string) {
    console.log(this.providersControl.value, toggledProvider)
    if (this.providersControl.value!.includes(toggledProvider)) {
      this.providersControl.setValue(this.providersControl.value!.filter((value) => value !== toggledProvider))
    } else {
      this.providersControl.setValue(this.providersControl.value!.concat(toggledProvider));
    }

    this.reloadInstrumentsStore();
  }

  reloadInstrumentsStore() {
    this.instrumentsLazyLoadingOptionsService.resetStore();
    this.loadNewChunk({ page: 0, size: this.pageSize })
  }

  private loadNewChunk(paginationPayload: PaginationPayload) {
    const filterPayload: FilterParam[] = [
      { key: 'symbol', value: this.symbolControl.value },
      { key: 'provider', value: this.providersControl.value },
    ]

    this.instrumentsLazyLoadingOptionsService.loadInstrumentsChunk(filterPayload, paginationPayload);
  }

  writeValue(instrument: InstrumentWithMappedProvider | null): void {
    this.instrumentControl.setValue(instrument, { emitEvent: false });
  }

  registerOnChange(fn: (instrument: InstrumentWithMappedProvider | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private listenInstrumentChanges() {
    this.instrumentControl.valueChanges
      .pipe(
        tap((value) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe()
  }

  private listenSymbolChanges() {
    this.symbolControl.valueChanges
      .pipe(
        // to prevent high frequent events (from user keypress)
        debounceTime(300),
        tap(() => this.reloadInstrumentsStore()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe()
  }
}
