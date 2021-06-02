import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { Application } from 'src/app/models/application.model';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { NgForm } from '@angular/forms';

// new
const MAX_STARS = 5;

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})

export class TripDisplayComponent extends TranslatableComponent implements OnInit {

  trip = new Trip();
  application = new Application();
  id: string;
  submitted = false;
  applicationForm: FormGroup;
  // new var
  starArray: boolean[];
  // Comentario que recogemos del formulario HTML
  comments: String[];
  actualDate = new Date();
  data: Application[];
  //data: Application[];
  price: number;
  actorid: string;
  trips = {};

  constructor(private tripservice: TripService,
    private applicationservice: ApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private translateservice: TranslateService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    super(translateservice);
  }

  ngOnInit() {
    // A partir del listado de trips, el usuario selecciona un viaje que tiene un id concreto que se pasa por la URL y que aquí recuperamos
    this.id = this.route.snapshot.params['id'];
    // Una vez que ya tenemos el id, podemos usarlo para llamar al método "getTrip" que devuelve un trip dado su ID
    this.tripservice.getTrip(this.id)
      // Las llamadas a los métodos de los servicios como suelen ir a backend, no devuelven el objeto sino que devuelven promesas
      // De manera que cuando se resuelva la promesa, lo que me devuelve el método "getTrip" es un trip que se guarda en la variable trip
      .then((val) => {
        this.trip = val;
        console.log('Trip id:' + this.trip.id);
        // new
        // if (this.trip.comments != null) {
        //   this.applicationservice.getApplications()
        //   .then((val) => {this.application.id = val; }
        //   );
        // }
      })
      .catch((err) => {
        console.error(err);
      }
      );
  }

  // Método que se ejecuta cuando el usuario hace click en el botón "Solicitar Viaje" para crear una aplicación
  onCreated(form: NgForm) {

    // Recojo la variable comentario que el usuario ha introducido en el formulario
    if (form.value.comments) {
      this.comments = form.value.comments;
    }

    // Aquí creamos la estructura que se guardará dentro del JSON SERVER cuando se guarde una nueva aplicación
    const applicationjson = {
      ticker: this.trip.ticker,
      actorid: this.authService.getCurrentActor().id,
      actorname: this.authService.getCurrentActor().name,
      tripid: this.trip.id,
      tripname: this.trip.title,
      status: this.trip.status,
      comments: this.trip.comments,
      reject_reason: '',
      if_paid: '',
      validated: '',
      cancelationMoment: '',
      created: new Date()
    };

    console.log('Application creada: ' + applicationjson);
    this.applicationservice.registerApplication(applicationjson)
      .then((val) => {
        // this.trip = val;
        console.log(val);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Este método sirve para navegar hacia atrás en el display de trips, es decir, para tener un botón para volver atrás al listado
  goBack(): void {
    this.router.navigate(['/trips']);
  }

  // new method
  getComments() {
    return this.trip.comments;
  }
  // new method
  getStarArray(number: number): number[] {
    let i = 1;
    const starArray = [];
    while (i <= MAX_STARS) {
      starArray.push(i < number);
      i++;
    }
    return starArray;
  }

  validateDate(date: string): boolean {
    return ((new Date(date).getTime() - this.actualDate.getTime()) / (1000 * 60 * 60 * 24) > 7);
  }

  onCancelled() {
    console.log('This trip has been cancelled');
  }

  onDelete() {
    this.tripservice.deleteTrip(this.trip).subscribe(
      (      res: any) => {
        alert(res);
      },
      (      err: { status: number; }) => {
        if (err.status === 422) {
          console.log(err);
        } else {
          console.log('Algo salió mal. Por favor, póngase en contacto con el administrador.');
        }
      }
    );
    setTimeout(() => { location.reload(); }, 1200);
  }

}
