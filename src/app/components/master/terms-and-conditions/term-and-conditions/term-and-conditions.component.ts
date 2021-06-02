import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-term-and-conditions',
  // En este caso lo vamos a configurar todo dentro de la variable innerHtml que lo incrustaremos en el siguiente div
  template: `<div [innerHtml]='myTemplate'></div>`,
  styleUrls: ['./term-and-conditions.component.css']
})
export class TermAndConditionsComponent implements OnInit {
  private myTemplate: any = '';
  // htmlFile es la ruta con el fichero de términos y condiciones a falta de indicar el idioma, se lo tendremos que preguntar al servicio
  private htmlFile = 'assets/terms-and-conditions/terms-and-conditions_'
  + this.translateService.currentLang + '.html';

  constructor(private translateService: TranslateService,
    private http: Http, private sanitizer: DomSanitizer,
    private router: Router) {
      this.http.get(this.htmlFile).subscribe((html) => {
        this.myTemplate = sanitizer.bypassSecurityTrustHtml(html.text());
      });

    // Hacemos uso de los observables de Angular
    // Nos suscribimos al evento para que nos avise cuando cambie el idioma, y nos devolverá el en, es, etc para construir el fichero html
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.htmlFile = 'assets/terms-and-conditions/terms-and-conditions_'
      + event.lang + '.html';
      this.http.get(this.htmlFile).subscribe((html) => {
        this.myTemplate = sanitizer.bypassSecurityTrustHtml(html.text());
      });
    });

     }

  ngOnInit() {
  }
}
