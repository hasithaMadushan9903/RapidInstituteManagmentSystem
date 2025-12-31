import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { monthWiseIncomesResponseVM } from '../models/monthWiseIncomeResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherPaymentCourseService {

  private BaseURL = `${environment.apiUrl}/teacherpaymentcoursectrl`

  constructor(private httpClient: HttpClient) { }

  getTeacherPaymentByMonth(year : number) : Observable<monthWiseIncomesResponseVM>{
    return this.httpClient.get<monthWiseIncomesResponseVM>(`${this.BaseURL}/getteacherpaymentbymonth/${year}`); 
  }
}
