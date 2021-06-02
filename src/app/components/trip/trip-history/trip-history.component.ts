import { Component, OnInit } from '@angular/core';
import { TripHistoryService } from 'src/app/services/trip-history.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TripHistory } from 'src/app/models/trip-history';


@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.css']
})
export class TripHistoryComponent implements OnInit {

  id: string;
  tripHistory = new TripHistory();
  data: TripHistory[];


  constructor(private tripHistoryService : TripHistoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.tripHistoryService.getTripForHistory(this.id)
    .then ((val) => {
      this.tripHistory = val;
      console.log ('Trip id:' + this.tripHistory.id);
    })
    .catch((err) => {
      console.error (err);
  }
  );
  }

}
