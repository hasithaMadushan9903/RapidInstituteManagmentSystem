import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthsResponseVM } from '../models/monthsResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthService {

  private BaseURL = `${environment.apiUrl}/monthctrl`

  constructor(private httpClient: HttpClient) { }

  getMonths() : Observable<MonthsResponseVM>{
    return this.httpClient.get<MonthsResponseVM>(`${this.BaseURL}/getmonths`);
  }
}
