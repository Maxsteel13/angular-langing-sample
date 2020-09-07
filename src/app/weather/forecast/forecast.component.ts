import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Observable } from 'rxjs';
import { ForecastResponse } from '../forecast';
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  forecast$: Observable<ForecastResponse[]>;

  constructor(private weatherService: WeatherService) {
    this.forecast$ = weatherService.getForecast();
  }

  ngOnInit(): void {
  }

}
