import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpcleint=inject(HttpClient);
  
    getAllUser(pageIndex: number, pageSize: number): Observable<any> {
      const params = {
        pageIndex: pageIndex,
        pageSize: pageSize
      };
    
      return this.httpcleint.get(`${environment.BaseUrl}/api/User`, { params });
    }
    getAllUserById(id:number):Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/User/${id}`);
    }
  }
