import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { Actor } from '../../../models/actor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { Search } from 'src/app/models/search';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends TranslatableComponent implements OnInit {

  currentActor: Actor;
  // Usaremos la variable activeRole para saber cual es el rol del usuario actual logueado en el sistema
  private activeRole = 'anonymous';
  // Usamos esta variable para subscribirnos
  private userLoggedIn: boolean;
  // Usamos la variable busqueda para el formulario de buscar un viaje
  private busqueda: Search = { text: null };

  constructor(private translateService: TranslateService,
    private messageService: MessageService,
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tripservice: TripService) {
    super(translateService);
  }

  changeLanguage(language: string) {
    super.changeLanguage(language);
  }

  ngOnInit() {
    this.currentActor = this.authservice.getCurrentActor();
    if (this.currentActor != null) {
      // Si el currentActor existe, obtenemos su rol
      this.activeRole = this.currentActor.role.toString();
    } else {
      // En caso contrario no hay ningún usuario logueado y por lo tanto el activeRole es "anonymous"
      this.activeRole = 'anonymous';
    }

    // Ahora nos subscribimos a la variable userLoggedIn que nos dirá si un usuario se ha logueado o no en el sistema
    // Dentro de authservice, en el método login() tomará el valor true y en el método logout() tomará el valor false
    this.authservice.userLoggedIn.subscribe((loggedIn: boolean) => {
      // Si el usuario está logueado
      if (loggedIn) {
        // Le preguntamos de nuevo al servicio de autenticación por el usuario que se acaba de loguear en la aplicación
        this.currentActor = this.authservice.getCurrentActor();
        // Obtenemos el rol activo, que es el valor que tendremos que comprobar
        this.activeRole = localStorage.getItem('activeRole');
      } else {
        // En este caso, el cambio es que el usuario se ha deslogueado y por lo tanto el activeRole es de nuevo "anonymous"
        this.activeRole = 'anonymous';
        this.currentActor = null;
      }
    });
  }

  // Cuando el usuario hace click en logout tengo que llamar al servicio y actualizar el header para mostrar que se ha salido del sistema
  logout() {
    this.authservice.logout()
      .then(_ => {
        // Cuando todo ha ido correcto, el actor actual pasa a ser anónimo
        // localStorage.setItem('activeRole', 'anonymous');
        localStorage.setItem('currentActor', '');
        this.currentActor = null;
        // Al hacer click en "logout" redirigimos al usuario a la pantalla de login
        this.router.navigate(['login']);
        this.messageService.notifyMessage('messages.auth.logout', 'alert alert-success');
      })
      .catch(error => {
        this.messageService.notifyMessage('errorMessages.auth.logout.failed', 'alert alert-danger');
        console.log(error);
      });
  }
}
