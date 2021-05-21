import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-search-trip',
  templateUrl: './search-trip.component.html',
  styleUrls: ['./search-trip.component.css']
})
export class SearchTripComponent implements OnInit {

  // Array de Trips donde almacenamos el listado de viajes
  data: Trip[];
  // Usamos la variable title para recojer lo que el usuario introdujo en el cuadro de búsqueda del formulario "buscar"
  title: string;
  navigationSubscription;

  constructor(private fb: FormBuilder,
    private tripservice: TripService,
    private router: Router,
    private translateservice: TranslateService,
    public authService: AuthService,
    private route: ActivatedRoute) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationStart) {
        this.getTrips();
      }
    });
  }

  ngOnInit() {
    this.getTrips();
  }

  // Devuelve el listado de todos los viajes asociados a un determinado nombre (title)
  getTrips() {
    // Recogemos el título del viaje introducido por el usuario en el cuadro de búsqueda
    this.title = this.route.snapshot.params['title'];
    // console.log('He recibido por parámetros: ' + this.title);
    // El método getTitle es el que verdaderamente devuelve el listado de todos los viajes asociados a un determinado nombre (title)
    this.tripservice.getTitle(this.title)
      .then((val) => {
        this.data = val;
         // console.log('Listado de viajes: ' + JSON.stringify(this.data));
      })
      .catch((err) => console.error(err.message));
  }
}
