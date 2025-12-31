import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actionVM } from '../models/actionVM';
import { actionResponseVM } from '../models/actionResponseVM';
import { actionsResponseVM } from '../models/actionsResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = `${environment.apiUrl}/actionctrl`;

  addAction(action : actionVM) :Observable<actionResponseVM>{
    return this.httpClient.post<actionResponseVM>(`${this.BaseURL}/addaction`,action);
  }

  getActions():Observable<actionsResponseVM>{
    return this.httpClient.get<actionsResponseVM>(`${this.BaseURL}/getactions`)
  }

  updateOrDeleteAction(action : actionVM):Observable<actionResponseVM>{
    return this.httpClient.put<actionResponseVM>(`${this.BaseURL}/updateappicon`,action);
  }
}
