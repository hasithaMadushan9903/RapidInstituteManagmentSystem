import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { privilagesVM } from '../models/privilagesVM';
import { privilageResponse } from '../models/privilageResponseVM';
import { privilagesResponse } from '../models/privilagesResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivilageService {

  private BaseURL = `${environment.apiUrl}/privilagectrl`;

  constructor(private httpClient: HttpClient) { }

  addPrivilages(privilage : privilagesVM[]) : Observable<privilagesResponse>{
    return this.httpClient.post<privilagesResponse>(`${this.BaseURL}/addprivilages`,privilage);
  }

  getPrivilages() : Observable<privilagesResponse> {
    return this.httpClient.get<privilagesResponse>(`${this.BaseURL}/getprivilages`);
  }

  deletePrivilage(privilage : privilagesVM) : Observable<privilageResponse>{
    return this.httpClient.put<privilageResponse>(`${this.BaseURL}/deleteprivilage`,privilage);
  }
}
