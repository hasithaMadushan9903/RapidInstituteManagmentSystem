import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeSlotsResponse } from '../models/timeSlotsResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {

  private BaseURL = `${environment.apiUrl}/timeslotctrl`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getTimeSlots() : Observable<timeSlotsResponse>{
    return this.httpClient.get<timeSlotsResponse>(`${this.BaseURL}/gettimeslot`);
  }
}
