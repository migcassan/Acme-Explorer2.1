import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent extends TranslatableComponent implements OnInit {

  actor: Actor;
  data: Trip[];

  constructor(private fb: FormBuilder,
    private tripservice: TripService,
    private router: Router,
    private translateservice: TranslateService,
    public authService: AuthService,
    private route: ActivatedRoute) {
      super (translateservice);
     }

  ngOnInit() {
    this.tripservice.getTrips()
    .then ((val) => {
      this.data = val;
      console.log('Listado de viajes: ' + this.data);
    })
    .catch((err) => console.error(err.message));
    this.actor = this.authService.getCurrentActor();
  }

  newTrip() {
    this.router.navigate(['/TripCreateComponent']);
   }
}
