import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportTypeMappingResponseVM } from '../models/reportTypeMappingResponseVM';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportTypeMappingService {

  private BaseURL = `${environment.apiUrl}/reporttypemappingctrl`;
  
  constructor(private httpClient: HttpClient) { }

  getReportsUnderRole(roleId : number) : Observable<ReportTypeMappingResponseVM>{
    return this.httpClient.get<ReportTypeMappingResponseVM>(`${this.BaseURL}/getreportsunderrole/${roleId}`);
  }
}
