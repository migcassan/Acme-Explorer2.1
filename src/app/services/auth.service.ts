import { Injectable } from '@angular/core';
import {Actor} from '../models/actor.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { HttpHeaders,  HttpClient } from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
 };

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private fireAuth: AngularFireAuth,
    private http: HttpClient) {
    }


  registerUser (actor: Actor) {
    return new Promise<any>((resolve, reject) => {
     this.fireAuth.auth.createUserWithEmailAndPassword (actor.email, actor.password)
      .then (_ => {
        const headers = new HttpHeaders ();
        headers.append ('Content-Type', 'application/json');
        const url = `${environment.backendApiBaseUrl + '/actors'}`;
        const body = JSON.stringify(actor);
      this.http.post (url, body, httpOptions).toPromise()
        .then (res => {
          resolve (res);
        }, err => {
          reject (err);
      });
    }).catch (error => {
       reject(error);
      });
    });
  }

  login (email: string, password: string) {
    return new Promise<any | void>((resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(_ => {
        resolve(_);
      }).catch(error => {
        reject(error);
      });
    });
    }

  getRoles(): string[] {
    return ['CLERK', 'ADMINISTRATOR', 'CONSUMER'];
  }
  logout() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.signOut()
        .then(_ => {
          resolve(_);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
