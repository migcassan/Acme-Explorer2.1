import { Component, OnInit } from '@angular/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { Application } from 'src/app/models/application.model';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from 'src/app/services/application.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-application-update',
  templateUrl: './application-update.component.html',
  styleUrls: ['./application-update.component.css']
})

export class ApplicationUpdateComponent extends TranslatableComponent implements OnInit {

  data: Application[];
  price: number;
  actorid: string;
  trips = {};
  statusList = ['Pending', 'Approved', 'Cancelled', 'Due', 'Rejected'];
  id: string;
  due = 'DUE';

  constructor(private fb: FormBuilder,
    private applicationservice: ApplicationService,
    private router: Router,
    private translateservice: TranslateService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tripservice: TripService) {
    super(translateservice);
  }

  ngOnInit() {
    this.getApplication();

    this.tripservice.getTrips()
      .then((val) => {
        val.forEach(val => {
          // Con la siguiente línea, hacemos uso del diccionario y a cada id le estamos asignando su precio
          this.trips[val.id] = val.price;
        });
        console.log('Listado de todos los ids de viajes junto a su precio: ' + JSON.stringify(this.trips));
      })
      .catch((err) => console.error(err.message));
  }

  getApplication() {
    // Obtenemos el listado de todas las aplicaciones de un actor a partir de su id
    this.actorid = this.authService.getCurrentActor().id;
    this.applicationservice.getApplicationsActor(this.actorid)
      .then((val) => {
        // Rellenamos la variable local "data" con las aplicaciones que nos ha devuelto el Json Server
        this.data = val;
        console.log('Listado de viajes: ' + JSON.stringify(this.data));
      })
      .catch((err) => console.error(err.message));
  }

  onCreated(data) {
    this.applicationservice.getApplications();
    this.applicationservice.updateApplication(data)
    .then((val) => {
      val.forEach(val => {
        this.trips[val.statusList='Pending']='Due';
      });
      console.log("Estoy pasando por este punto");

      console.log('Listado de viajes: ' + JSON.stringify(this.trips));
    })
    .catch((err) => console.error(err.message));
  }
}
