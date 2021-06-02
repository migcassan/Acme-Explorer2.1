import { Component, OnInit } from '@angular/core';
import { Application } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatableComponent } from 'src/app/components/shared/translatable/translatable.component';
import { FormBuilder } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})

export class ApplicationListComponent extends TranslatableComponent implements OnInit {

  data: Application[];
  price: number;
  actorid: string;
  trips = {};

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
          this.trips[val.id] = val.price;
        });
        console.log('Listado de todos los ids de viajes junto a su precio: ' + JSON.stringify(this.trips));
      })
      .catch((err) => console.error(err.message));
  }

  getApplication() {
    this.actorid = this.authService.getCurrentActor().id;
    this.applicationservice.getApplicationsActor(this.actorid)
      .then((val) => {
        this.data = val;
        console.log('Listado de aplicaciones del actor actual: ' + JSON.stringify(this.data));
      })
      .catch((err) => console.error(err.message));
  }
}

