import { DropdownOption } from '@shared/core/models';

export enum Periodicity {
  Hour = 'Hour',
  Minute = 'Minute',
  Day = 'Day',
  Week = 'Week',
}

export interface MarketData {
  symbol: string;
  price: number;
  time: string;
}

export interface HistoryFrequencyPayload {
  interval: number;
  periodicity: Periodicity;
}

export const historyFrequencyOptions: DropdownOption<HistoryFrequencyPayload>[] = [
  { name: '1 Minute', value: { interval: 1, periodicity: Periodicity.Minute } },
  { name: '5 Minutes', value: { interval: 5, periodicity: Periodicity.Minute } },
  { name: '15 Minutes', value: { interval: 15, periodicity: Periodicity.Minute } },
  { name: '1 Hour', value: { interval: 1, periodicity: Periodicity.Hour } },
  { name: '4 Hours', value: { interval: 4, periodicity: Periodicity.Hour } },
  { name: '1 Day', value: { interval: 1, periodicity: Periodicity.Day } },
  { name: '1 Week', value: { interval: 1, periodicity: Periodicity.Week } },
]
