import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Actor } from 'src/app/models/actor.model';

// new
const MAX_STARS = 5;

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

   displayTrip(trip: Trip) {
    const date = new Date();
    const date_start = new Date(trip.date_start)
    return trip.published && (date_start.getTime() + 7 > date.getTime());
}

   // new method
  getStarArray(it: Trip): number[] {
    const numStars = this.tripservice.getStars(it);
    let i = 1;
    const starArray = [];
    while (i <= MAX_STARS) {
      starArray.push(i <= numStars);
      i++;
    }
    return starArray;
  }
}
