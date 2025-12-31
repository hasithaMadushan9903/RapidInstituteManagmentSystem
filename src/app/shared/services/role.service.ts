import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { roleVM } from '../models/roleVM';
import { roleResponseVM } from '../models/roleResponseVM';
import { Observable } from 'rxjs';
import { rolesResponseVM } from '../models/rolesResponseVM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private BaseURL = `${environment.apiUrl}/rolectrl`;

  constructor(private httpClient: HttpClient) { }
  
  addRole(role : roleVM) : Observable<roleResponseVM>{
    return this.httpClient.post<roleResponseVM>(`${this.BaseURL}/addrole`,role);
  }

  getRoles() : Observable<rolesResponseVM>{
    return this.httpClient.get<rolesResponseVM>(`${this.BaseURL}/getroles`);
  }

  updateAndDeleteRole(role : roleVM) : Observable<roleResponseVM>{
    return this.httpClient.put<roleResponseVM>(`${this.BaseURL}/updaterole`,role)
  }
}
