import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type Message = {
  message: string;
  type: 'success' | 'error';
};

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];
  add(message: string) {
    this.messages.push(message);
  }
  clear() {
    this.messages = [];
  }
}
