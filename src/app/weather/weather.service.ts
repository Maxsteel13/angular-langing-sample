import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { pipe, Observable, observable, of } from 'rxjs';
import {map, switchMap, pluck, filter, mergeMap, toArray} from 'rxjs/operators';
import {ForecastResult, ForecastResponse} from './forecast';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  readonly apiKey = '6a4a0aa536d023adc8b668e54ea47442';
  readonly baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  constructor(private http: HttpClient) { }

  getFiveDayForecast(lat: number, long: number): Observable<ForecastResult>{

    const apiUrl = `${this.baseApiUrl}/forecast?lat=${lat}&lon=${long}&appid=${this.apiKey}`;
    return this.http.get<ForecastResult>(apiUrl);
  }

  // tslint:disable-next-line:typedef
  getForecast(): Observable<ForecastResponse[]> {
    const apiUrl = `${this.baseApiUrl}/forecast`;
    return this.getCurrentPosition().pipe(
      map(coords => {
        return new HttpParams()
        .set('lat', coords.latitude.toString())
        .set('lon', coords.longitude.toString())
        .set('units', 'metric')
        .set('appid', this.apiKey);
      }),
      switchMap(params => this.http.get<ForecastResult>(apiUrl, { params })), // use this as the new active observable
      pluck('list'),
      mergeMap(value => of(...value)), // break down array into a stream of individual values so it's easier to filter
      filter((value, index) => index % 8 === 0), // filter the stream of values
      map((value) => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp
        };
      }),
      toArray()
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
