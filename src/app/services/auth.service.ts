import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
import {  HttpHeaders, HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/services/message.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // Variable de tipo Actor para almacenar el actor actual que se acaba de loguear
  private currentActor: Actor;
  // Observable que le sirve al header para actualizarse y mostrar una opción o otra en base al usuario que esté logueado en el sistema
  userLoggedIn = new Subject ();

  constructor(private fireAuth: AngularFireAuth,
    private messageService: MessageService,
    private http: HttpClient,
    private cookieService: CookieService) {
    }

    // Método que devuelve parseado el usuario logueado actualmente del localStorage
    getCurrentActor() {
      let result = null;
      // con getItem obtenemos el currentActor
      const currentActor = localStorage.getItem('currentActor');
      // Vemos si es nulo
      if (currentActor) {
        // Si no es nulo, lo parseamos y lo devolvemos como resultado del método
        result = JSON.parse(currentActor);
      } else {
        // En caso contrario, mostramos un mensaje que indica que no hay ningún usuario almacenado en localStorage
        // Según el caso este mensaje tendrá sentido o no
        // this.messageService.notifyMessage('auth.user.not.found', 'alert alert-danger');
      }
      return result;
    }

  // Método que almacena un nuevo usuario dentro del Json Server
   registerUser (actor: Actor) {
    return new Promise<any>((resolve, reject) => {
      // Llamamos a firebase para registrar al usuario con el email y el password
     this.fireAuth.auth.createUserWithEmailAndPassword (actor.email, actor.password)
      .then (_ => {
        const headers = new HttpHeaders ();
        headers.append ('Content-Type', 'application/json');
        const url = `${environment.apiBaseUrl + '/actors'}`; // http://localhost:3000/actors
        const body = JSON.stringify(actor);
      this.http.post (url, body, httpOptions).toPromise()
        .then (res => {
           this.messageService.notifyMessage('messages.auth.registration.correct', 'alert alert-success');
           // Llamamos a "resolve" cuando resolvemos la promesa en caso satisfactorio
          resolve (res);
        }, err => { this.messageService.notifyMessage('errorMessage.auth.registration.failed', 'alert alert-danger');
        // Llamamos a "reject" cuando la promesa falla
        reject (err);
      });
      }).catch (error => {
         this.messageService.notifyMessage('errorMessages.' + error.code.replace(/\//gi, '.').replace(/\-/gi, '.'), 'alert alert-danger');
         // Llamamos a "reject" cuando la promesa falla
         reject(error);
      });
      });
    }

  getRole(): any {
    throw new Error('Method not implemented.');
  }


  login (email: string, password: string) {
    // La función devuelve una promesa ya que Firebase también devuelve una promesa
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise<any>((resolve, reject) => {
      // Le pasamos el email y el passsword a Firebase
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
        .then(_ => {
        // Si todo ha ido bien en fireBase invoco a mi backend (Json Server en nuestro caso) con el email para recuperar el actor
        const url = environment.apiBaseUrl + `/actors?email=` + email; // http://localhost:3000/actors?email
        const token = this.fireAuth.auth.currentUser.getIdToken;
        console.log(token);
        this.http.get<Actor[]>(url).toPromise()
          .then((actor: Actor[]) => {
            // Este método setCurrentActor recibe un actor y lo almacena en el localStorage
            this.setCurrentActor(actor[0], token);
            this.userLoggedIn.next(true);
            // Mensaje que se muestra cuando todo ha ido correctamente
            this.messageService.notifyMessage('messages.auth.login.correct', 'alert alert-success');
            
            //this.messageService.notifyMessage.clear();
            // Hacemos el resolve que ahora devuelve el actor actual que se acaba de loguear
            // Este resolve nos sirve para saber el actor actual y su rol en el sistema
            // resolve(this.currentActor);
            resolve(actor[0]);
        }).catch(error =>  {
          this.messageService.notifyMessage('errorMessages.auth.login.failed', 'alert alert-danger');
          // Llamamos a "reject" cuando la promesa falla
          reject(error);
        });
        // Si firebase devuelve algún error lo capturamos
        }).catch(error => {
        this.messageService.notifyMessage ('errorMessages.' + error.code.replace(/\//gi, '.').replace(/\-/gi, '.'), 'alert alert-danger');
        // Llamamos a "reject" cuando la promesa falla
        reject(error);
        });
      });
  }


  logout() {
    // La función devuelve de nuevo una promesa ya que Firebase también devuelve una promesa
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.signOut()
        .then(_ => {
          // Al hacer logout es muy importante que tengo que eliminar la información del localStorage
          // Eliminamos la información enviando null al setCurrentActor
          this.setCurrentActor(null);
          this.userLoggedIn.next(false);
          // Llamamos a "resolve" cuando resolvemos la promesa en caso satisfactorio
          resolve(_);
      // Si firebase devuelve algún error lo capturamos
      }).catch(error => {
        // Llamamos a "reject" cuando la promesa falla
        reject(error);
        this.messageService.notifyMessage(error.code, 'alert alert-danger');
      });
    });
}
checkRole (roles: string ): boolean {
  let result = false;
  const currentActor = this.getCurrentActor();
    if (currentActor) {
      if (roles.indexOf(currentActor.role.toString()) !== -1) {
      result = true;
    } else {
      result = false;
    }
    // Si no existe el currentActor, pero el usuario actual es anónimo, entonces también le tengo que dejar paso devolviendo true
  } else {
    if (roles.indexOf('anonymous') !== -1) {
      result = true;
    } else {
      result = false;
    }
  }
return result;
}

// Este método si recibe un actor lo guarda en el localStorage y si recibe un token lo guarda en la cookie
// El símbolo ? significa que el parámetro para el token es opcional
setCurrentActor(actor: any, token?: any) {
  // Volvemos a comprobar que el actor exista y no sea nulo
  if (actor) {
    // JSON.stringify sirve para darle el formato que deseemos al JSON que se almacena en la variable currentActor.
    localStorage.setItem('currentActor', JSON.stringify({
      id: actor.id,
      name: actor.name,
      surname: actor.surname,
      role: actor.role,
      preferredLanguage: actor.preferredLanguage
    }));
    // Cuando me logueo, si hemos recibido el token, entonces lo guardamos en una cookie
    if (token) {
      this.cookieService.set('currentToken', token);
    }
    // Si el actor es nulo, es debido a que venimos del método logout, así que ahora lo que hago es eliminar el actor y el token
  } else {
    localStorage.removeItem('currentActor');
    this.cookieService.delete('currentToken');
  }
}

}
