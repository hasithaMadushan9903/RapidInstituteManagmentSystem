import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appIconVM } from '../models/appIconVM';
import { Observable } from 'rxjs';
import { appiconResponse } from '../models/appIconResponseVM';
import { appiconsResponse } from '../models/appIconsResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppIconService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = `${environment.apiUrl}/appiconctrl`;

  addAppIcon(appIcon : appIconVM) :Observable<appiconResponse>{
    return this.httpClient.post<appiconResponse>(`${this.BaseURL}/addappicon`,appIcon);
  }

  getAppIcons():Observable<appiconsResponse>{
    return this.httpClient.get<appiconsResponse>(`${this.BaseURL}/getappicons`)
  }

  updateOrDeleteAppIcons(appIcon : appIconVM):Observable<appiconResponse>{
    return this.httpClient.put<appiconResponse>(`${this.BaseURL}/updateappicon`,appIcon);
  }

}
