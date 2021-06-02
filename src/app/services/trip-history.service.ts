import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TripHistory } from '../models/trip-history';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TripHistoryService {

  trip: TripHistory;
  private tripUrl = `${environment.apiBaseUrl + '/trips'}`;

  constructor(private http: HttpClient) { }


  getTripForHistory(id: string) {
    const url = `${this.tripUrl}/${id}`;
    return this.http.get<TripHistory>(url).toPromise();
  }

  getTitleHistory(title: string) {
    const url = `${this.tripUrl}/?q=${title}`;
    return this.http.get<TripHistory[]>(url).toPromise();
  }

}
