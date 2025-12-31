import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { parentResponseVM } from '../models/parentResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  private BaseURL =  `${environment.apiUrl}/parentctrl`;

  constructor(private httpClient: HttpClient) { }

  getParentById(nic : string) : Observable<parentResponseVM>{
    return this.httpClient.get<parentResponseVM>(`${this.BaseURL}/getparentbyid/${nic}`);
  }

}
