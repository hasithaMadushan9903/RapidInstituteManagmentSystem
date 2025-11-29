import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportTypeMappingResponseVM } from '../models/reportTypeMappingResponseVM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportTypeMappingService {

  private BaseURL = "http://localhost:8080/api/v1/reporttypemappingctrl";
  
  constructor(private httpClient: HttpClient) { }

  getReportsUnderRole(roleId : number) : Observable<ReportTypeMappingResponseVM>{
    return this.httpClient.get<ReportTypeMappingResponseVM>(`${this.BaseURL}/getreportsunderrole/${roleId}`);
  }
}
