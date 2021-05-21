import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Application } from 'src/app/models/application.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-application-display',
  templateUrl: './application-display.component.html',
  styleUrls: ['./application-display.component.css']
})
export class ApplicationDisplayComponent implements OnInit {

  // Creamos una aplicación que será la que utilicemos para representarla luego en el display del html
  application = new Application();
  id: string;

  actorid: string;
  constructor(private applicationservice: ApplicationService,
     private router: Router, private route: ActivatedRoute,
     private translateservice: TranslateService, private authservice: AuthService ) {
     }

  // A este componente "Application-Display" se llega a partir del componente "Application-list" de donde recibimos además el id
  ngOnInit() {

    // Por la URL se pasa a este componente el id que aquí recuperamos
    this.id = this.route.snapshot.params['id'];
    // Una vez que ya tenemos el id, podemos usarlo para recuperar la aplicación completa
    this.applicationservice.getApplication(this.id)
    // Las llamadas a los métodos de los servicios como suelen generar llamadas a backend no devuelven el objeto sino que devuelven promesas
    // Cuando se resuelva la promesa, el método "getApplication" devuelve una aplicación que se guarda en la variable application
    .then ((val) => {
      this.application = val;
      console.log ('Trip id:' + this.application.id);
    })
    .catch((err) => {
      console.error (err);
  }
  );
}
}
