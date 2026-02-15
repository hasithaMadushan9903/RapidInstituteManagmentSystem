import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { payHereResponseVM } from '../models/payHereResponseVM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayhereService {

  private BaseURL = `${environment.apiUrl}/payherectrl`;
    
  constructor(private httpClient: HttpClient) { }

  payhereimplementationtest(orderId : string, amount : number, currency : string) : Observable<payHereResponseVM> {
    return this.httpClient.get<payHereResponseVM>(`${this.BaseURL}/init/${orderId}/${amount}/${currency}`);
  }

  veryfyPayment(orderId : string) : Observable<payHereResponseVM> {
    return this.httpClient.get<payHereResponseVM>(`${this.BaseURL}/veryfypayment/${orderId}`);
  }
}
