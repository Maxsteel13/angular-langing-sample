import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { pipe, Observable, observable } from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ForecastResult} from './forecast';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  readonly apiKey = '6a4a0aa536d023adc8b668e54ea47442';
  readonly baseApiUrl = 'api.openweathermap.org/data/2.5';
  constructor(private http: HttpClient) { }

  getFiveDayForecast(lat: number, long: number): Observable<ForecastResult>{

    const apiUrl = `${this.baseApiUrl}/forecast?lat=${lat}&lon=${long}&appid=${this.apiKey}`;
    return this.http.get<ForecastResult>(apiUrl);
  }

  getForecast(): void {
    this.getCurrentPosition().pipe(
      map(coords => {
        return new HttpParams()
        .set('lat', coords.latitude.toString())
        .set('lon', coords.longitude.toString())
        .set('units', 'metric')
        .set('appid', this.apiKey);
      })
    );
  }

  getCurrentPosition(): Observable<Coordinates> {
    return new Observable<Coordinates>((observer) => {
       window.navigator.geolocation.getCurrentPosition((position) => {
        observer.next(position.coords);
        observer.complete();
       },
       (err) => observer.error(err));
    });
  }
}
