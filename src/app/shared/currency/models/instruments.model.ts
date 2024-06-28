export interface Instrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  exchange: string;
  currency: string;
  tickSize: number;
  mappings: Record<string, ProviderInfo>;
}

export interface InstrumentWithMappedProvider extends Instrument {
  provider: string;
}

export interface InstrumentHistorySnapshot {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface ProviderInfo {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
}
