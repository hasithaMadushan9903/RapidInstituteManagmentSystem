import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { approvingStatusesResponseVM } from '../models/approvingStatusesResponsVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovingStatusService {

  private BaseURL = `${environment.apiUrl}/approvinststusctrl`;

  constructor(private httpClient: HttpClient) { }

  getApprovingStatuses() :Observable<approvingStatusesResponseVM>{
    return this.httpClient.get<approvingStatusesResponseVM>(`${this.BaseURL}/getapprovingstatuses`);
  }
}
