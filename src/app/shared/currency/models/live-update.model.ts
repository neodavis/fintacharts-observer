interface LiveBaseUpdateMessage {
  type: string;
  instrumentId: string;
  provider: string;
}

export interface LiveLastPriceUpdateMessage extends LiveBaseUpdateMessage {
  last: {
    timestamp: string;
    price: number;
    volume: number;
  };
}

