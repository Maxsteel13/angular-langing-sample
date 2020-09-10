import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

interface NotificationCommand {
  id: number,
  type: 'success' | 'clear' | 'error',
  text?: String;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messages: Subject<NotificationCommand>;

  constructor() {
    let initial:NotificationCommand[] = [];
    this.messages = new Subject<NotificationCommand>().pipe(
      scan((acc, value) => {

        if (value.type === 'clear') {
          const idx = acc.findIndex(x => x.id === value.id);
          acc.splice(idx, 1);

        } else {
          acc.push(value);
        }

        return acc;
      }, initial));
  }

  addSuccess(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'success'
    });
  }

  addError(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'error'
    });
  }

  clearMessage(id: number) {
    this.messages.next({
      id,
      type: 'clear'
    });
  }

  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
