import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { quizzVM } from '../models/quizzVM';
import { Observable } from 'rxjs';
import { quizzResponseVM } from '../models/quizzResponseVM';
import { quizzesResponseVM } from '../models/quizzesResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizeeService {
  private BaseURL = `${environment.apiUrl}/quizzctrl`;

  constructor(private httpClient: HttpClient) { }

  addQuizz(quizz : quizzVM) : Observable<quizzResponseVM>{
    return this.httpClient.post<quizzResponseVM>(`${this.BaseURL}/addquizz`,quizz);
  }

  getAllquizzes() : Observable<quizzesResponseVM>{
    return this.httpClient.get<quizzesResponseVM>(`${this.BaseURL}/getquizzes`);
  }

  getAllQuizeesForStudent(studentId:number): Observable<quizzesResponseVM>{
    return this.httpClient.get<quizzesResponseVM>(`${this.BaseURL}/getquizzesforstudent/${studentId}`);
  }

  getAllQuizeesForTeacher(teacherId:number): Observable<quizzesResponseVM>{
    return this.httpClient.get<quizzesResponseVM>(`${this.BaseURL}/getquizzesforteacher/${teacherId}`);
  }

  updateOrDelete(quizz : quizzVM):Observable<quizzResponseVM>{
    return this.httpClient.put<quizzResponseVM>(`${this.BaseURL}/updateordeletequizz`,quizz);
  }
}
