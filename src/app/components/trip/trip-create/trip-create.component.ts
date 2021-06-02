import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-create',
  templateUrl: './trip-create.component.html',
  styleUrls: ['./trip-create.component.css']
})
export class TripCreateComponent extends TranslatableComponent implements OnInit {

  // Creamos un atributo que va a ser el propio formulario (un grupo de campos formulario)
  registerForm: FormGroup;
  submitted = false;
  // Arrays que indican las opciones que tendrán el combo de status y idioma dentro del formulario de creación de viajes
  statusList = ['Pending', 'Approved', 'Cancelled', 'Due', 'Rejected'];
  idiomlist = ['en', 'es'];

  constructor(private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private tripService: TripService,
    private router: Router) {
    super(translateService);
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group
      ({
        ticker: [''],
        detalles: [''],
        cancelled_reason: [''],
        title: [''],
        cancelationMoment: [''],
        description: [''],
        price: Number,
        picture: [''],
        list_requirements: [''],
        status: ['Pending'], // Valores por defecto con los que se inicia el formulario
        date_start: [''],
        date_end: [''],
        published: [''],
        created: Date.now,
        preferredLanguage: [''],
      });
  }

  // Método que se ejecuta al hacer click en el botón de publicar el formulario
  onPublish() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log (this.registerForm.value);
      this.tripService.registerTrip(this.registerForm.value)
      .then(res => {
        console.log(res );
      }, err => { console.log(err + 'Real error'); });
  }
  }
}
