import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADAccountResponseVM } from '../models/adAccountResponseVM';
import { ADAccountVM } from '../models/adAccountVM';
import { loginDetailsResponseVM } from '../models/loginDetailsResponseVM';
import { ImageUploadVM } from '../models/ImageUploadVM';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AdAccountServiceService {

  private BaseURL = `${environment.apiUrl}/adaccountctrl`

  constructor(private httpClient: HttpClient) { }

  createUserAccount(adAccountVM : ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/createuseraccount`,adAccountVM);
  }

  updateUserAccount(adAccountVM : ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.put<ADAccountResponseVM>(`${this.BaseURL}/updateadacoount`,adAccountVM);
  }

  login(adAccountVM : ADAccountVM) : Observable<loginDetailsResponseVM>{
    return this.httpClient.post<loginDetailsResponseVM>(`${this.BaseURL}/checklogin`,adAccountVM);
  }

  getALogin(adAccount :ADAccountVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/getalogin`,adAccount);
  }

  updateProfilePicture(imageUploadVM : ImageUploadVM) : Observable<ADAccountResponseVM>{
    return this.httpClient.post<ADAccountResponseVM>(`${this.BaseURL}/updateprofilepicture`,imageUploadVM );
  }
}