import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InfoMessage } from '../components/master/message/infomessage';

export class MessageService {
  message: Subject<InfoMessage>;

  constructor() {
    this.message = new Subject();
   }

  notifyMessage (code: string, cssClass: string) {
    this.message.next(new InfoMessage (code, cssClass));
  }

  removeMessage () {
    this.message.next();
  }
}
