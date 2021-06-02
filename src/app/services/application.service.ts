import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Application } from '../models/application.model';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationUrl =  `${environment.apiBaseUrl + '/applications'}`;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getApplication (id: string) {
    const url = `${this.applicationUrl}/${id}`;
    return this.http.get<Application>(url).toPromise();
  }

  getApplicationsActor (actorid: string) {
    const url = `${this.applicationUrl}/?q=${actorid}`;
    return this.http.get<Application[]>(url).toPromise();
  }

  getApplications () {
    return this.http.get<Application[]>(this.applicationUrl).toPromise();
  }

  // Método que se ejecuta en "trip-display" cuando el usuario hace click en el botón "Solicitar Viaje" para crear una aplicación
  registerApplication (application: any) {
    return new Promise<any>((resolve, reject) => {
        const headers = new HttpHeaders ();
        headers.append ('Content-Type', 'application/json');
        const body = JSON.stringify(application);
        this.http.post (this.applicationUrl, body, httpOptions).toPromise()
          .then (res => {
            this.messageService.notifyMessage('application.create.application', 'alert alert-success');
            resolve (res);
          }, err => { this.messageService.notifyMessage('errorMessage.auth.registration.failed', 'alert alert-danger');
        reject (err); });
    });
  }

  // Método que actualiza el estado de una application. ApplicationUpdateComponent sería el componente que tendría que llamar a este método
  updateApplication (application: Application) {
    const url = `${this.applicationUrl}/${application}`;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(application);

    return new Promise<any>((resolve, reject) => {
      this.http.put(url, body, httpOptions).toPromise()
      .then(res => {
        resolve(res);
      }, err => { console.log(err);
        reject(err); });
    });
  }
}
