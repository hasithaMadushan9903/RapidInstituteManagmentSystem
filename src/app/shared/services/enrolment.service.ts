import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrolmentVM } from '../models/enrolmentVM';
import { EnrolmentsResponse } from '../models/enrolmentsResponseVM';
import { studentVM } from '../models/studentVM';
import { EnrolmentsResponses } from '../models/EnrolmentsResponsesVM';
import { isExsistResponseVM } from '../models/isExsistResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrolmentService {

  private BaseURL = `${environment.apiUrl}/enrolmentctrl`;

  constructor(private httpClient: HttpClient) { }

  addEnrolments(enrolments : EnrolmentVM[]) : Observable<EnrolmentsResponse>{
    return this.httpClient.post<EnrolmentsResponse>(`${this.BaseURL}/addEnrolments`,enrolments);
  }

  addEnrolment(enrolment : EnrolmentVM) : Observable<EnrolmentsResponse>{
    return this.httpClient.post<EnrolmentsResponse>(`${this.BaseURL}/addEnrolment`,enrolment);
  }

  getEnrolmentByStudent(student : studentVM) : Observable<EnrolmentsResponses>{
    return this.httpClient.post<EnrolmentsResponses>(`${this.BaseURL}/getenrolmentbystudent`,student);
  }
}
