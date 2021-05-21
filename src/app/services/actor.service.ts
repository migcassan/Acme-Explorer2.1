import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Actor } from '../models/actor.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class ActorService {

  token: string;
  userRole: string;
  private actorsUrl = environment.apiBaseUrl + '/actors';

  constructor(private http: HttpClient, private authService: AuthService) { }
  getActor (id: string) {
      const url = `${this.actorsUrl}/${id}`;
      return this.http.get<Actor>(url).toPromise();
  }

  getActors () {
    return this.http.get<Actor[]>(this.actorsUrl).toPromise();
  }

  getUsersByPhoneNumber (phoneNum: string): Promise<Actor[]> {
     return this.http.get<Actor[]>(this.actorsUrl + '?phone=' + phoneNum).toPromise();
  }

  updateProfile (actor: Actor) {
    const url =  `${this.actorsUrl}/${actor.id}`;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const body = JSON.stringify(actor);

    return new Promise<any>((resolve, reject) => {
      this.http.put(url, body, httpOptions).toPromise()
      .then(res => {
        const token = this. authService.getCurrentActor().customToken;
        this.authService.setCurrentActor(actor, token);
        resolve(res);
      }, err => { console.log(err);
        reject(err); });
    });
  }
}
