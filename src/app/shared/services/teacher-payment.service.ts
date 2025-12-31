import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { teacherPayemntVM } from '../models/teacherPaymentVM';
import { classFeeResponse } from '../models/classFeeResponse';
import { Observable } from 'rxjs';
import { teacherPaymentResponseVM } from '../models/teacherPaymentResponseVM';
import { teacherPaymentsResponseVM } from '../models/teacherPaymentsResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherPaymentService {

  private BaseURL = `${environment.apiUrl}/teacherpaymentctrl`

  constructor(private httpClient: HttpClient) { }

  payTeacherPayment(teacherPayment : teacherPayemntVM) : Observable<teacherPaymentResponseVM> {
    return this.httpClient.post<teacherPaymentResponseVM>(`${this.BaseURL}/addteacherpayment`,teacherPayment);
  }

  getTeacherPaymentsByTeacherId(teacherId : number) : Observable<teacherPaymentsResponseVM>{
    return this.httpClient.get<teacherPaymentsResponseVM>(`${this.BaseURL}/getteacherpaymentbyteacherid/${teacherId}`);
  }

  getTeacherPayments() : Observable<teacherPaymentsResponseVM>{
    return this.httpClient.get<teacherPaymentsResponseVM>(`${this.BaseURL}/getteacherpayment`);
  }
}
