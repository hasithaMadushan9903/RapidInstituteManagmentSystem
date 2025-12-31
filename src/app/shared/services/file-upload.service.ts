import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/baseResponse';
import { StringTypeResponseVM } from '../models/stringTypeResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private BaseURL = `${environment.apiUrl}/fileuploadctrl`;

  constructor(private httpClient: HttpClient) { }

  uploadImageFile(formData: FormData) : Observable<StringTypeResponseVM>{
    return this.httpClient.post<StringTypeResponseVM>(`${this.BaseURL}/upload`,formData);
  }
}
