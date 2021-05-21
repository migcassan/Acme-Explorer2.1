import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { MessageService } from '../../../services/message.service';
import { InfoMessage } from './infomessage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent extends TranslatableComponent implements OnInit, OnDestroy {
  code: string;
  cssClass: string;
  // Usamos esta variable para subscribirnos
  subscription: Subscription;
  showMessage = true;

  constructor(private translateService: TranslateService,
    private messageService: MessageService) {
    super (translateService);
  }

  ngOnInit() {
    this.subscription = this.messageService.message.subscribe((data: InfoMessage) => {
        if (data) {
          this.code = data.code;
          this.cssClass = data.cssClass;
          this.showMessage = true; // El mensaje se tiene que mostar
        } else {
            this.showMessage = false; // El mensaje no se tiene que mostar
        }
      });
  }

  ngOnDestroy () {
    // Eliminamos la subscripción
    this.subscription.unsubscribe();
  }
}
