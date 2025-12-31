import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Attemptvm } from '../models/attemptVM';
import { ScoreResponseVM } from '../models/scoreResponseVM';
import { Observable } from 'rxjs';
import { StudentQuizReportResponseVM } from '../models/studentQuizReportResponseVM';
import { ManagerQuizReportResponseVM } from '../models/managerQuizReportResponseVM';
import { TeacherQuizReportResponseVM } from '../models/teacehrQuizReportResponseVM';
import { IncomeReportResponseVM } from '../models/IncomeReportResponseVM';
import { StudentAttendnceReportDataResponseVM } from '../models/StudentAttendnceReportDataResponseVM';
import { IncomeReportDataForFrontdeskOfficerResponseVM } from '../models/IncomeReportDataForFrontdeskOfficerResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttemptService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = `${environment.apiUrl}/attemptctrl`;

  addAttept(attemptvm : Attemptvm) :Observable<ScoreResponseVM>{
    return this.httpClient.post<ScoreResponseVM>(`${this.BaseURL}/addquizattempt`,attemptvm);
  }

  getStudentQuizReportData(studentId : number) :Observable<StudentQuizReportResponseVM>{
    return this.httpClient.get<StudentQuizReportResponseVM>(`${this.BaseURL}/getstudentquizreportdata/${studentId}`);
  }

  getTeacherQuizReportData(teacherId : number) :Observable<TeacherQuizReportResponseVM>{
    return this.httpClient.get<TeacherQuizReportResponseVM>(`${this.BaseURL}/getteacherquizreportdata/${teacherId}`);
  }

  getManagerQuizReportData() :Observable<ManagerQuizReportResponseVM>{
    return this.httpClient.get<ManagerQuizReportResponseVM>(`${this.BaseURL}/getmanagerquizreportdata`);
  }

  getIncomeReportData(year : number) :Observable<IncomeReportResponseVM>{
    return this.httpClient.get<IncomeReportResponseVM>(`${this.BaseURL}/getincomereportdata/${year}`);
  }

  getExpencesReportData(year : number) :Observable<IncomeReportResponseVM>{
    return this.httpClient.get<IncomeReportResponseVM>(`${this.BaseURL}/getexpencesreportdata/${year}`);
  }

  getStudentAttendanceReportData(studentId : number, year : number) :Observable<StudentAttendnceReportDataResponseVM>{
    return this.httpClient.get<StudentAttendnceReportDataResponseVM>(`${this.BaseURL}/getstudentattendancereportdata/${studentId}/${year}`);
  }

  GetIncomeReportDataForFrontdeskOfficer(monthId : number, courseId : number) :Observable<IncomeReportDataForFrontdeskOfficerResponseVM>{
    return this.httpClient.get<IncomeReportDataForFrontdeskOfficerResponseVM>(`${this.BaseURL}/getincomereportdataforfrontdeskofficer/${monthId}/${courseId}`);
  }
}
