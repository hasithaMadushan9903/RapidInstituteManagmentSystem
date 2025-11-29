import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/baseResponse';
import { StringTypeResponseVM } from '../models/stringTypeResponseVM';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private BaseURL = "http://localhost:8080/api/v1/fileuploadctrl";

  constructor(private httpClient: HttpClient) { }

  uploadImageFile(formData: FormData) : Observable<StringTypeResponseVM>{
    return this.httpClient.post<StringTypeResponseVM>(`${this.BaseURL}/upload`,formData);
  }
}
