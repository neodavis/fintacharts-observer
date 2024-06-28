import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebsocketObserverService {
  private _messages$ = new Subject<unknown>();
  private _socket: WebSocket | null = null;
  private _socketOpened$ = new Subject<boolean>();

  get messages$() {
    return this._messages$.asObservable();
  }

  get socketOpened$() {
    return this._socketOpened$.asObservable();
  }

  connect(url: string): void {
    if (this._socket) {
      this.disconnect();
    }

    this._socket = new WebSocket(url);

    this._socket.onopen = () => {
      this._socketOpened$.next(true);
    }

    this._socket.onmessage = (event) => {
      this.onMessage(event.data);
    };

    this._socket.onerror = () => {
      this.disconnect();
    };

    this._socket.onclose = () => {
      this.disconnect();
    };
  }

  sendMessage(message: string) {
    this._socket?.send(message)
  }

  disconnect(): void {
    this._socket?.close();
    this._socket = null;
    this._socketOpened$.next(false);
  }

  private onMessage(message: string): void {
    this._messages$.next(JSON.parse(message));
  }

}
